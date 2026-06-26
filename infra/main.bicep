// ================================================================
// Portfolio Azure Infrastructure
// Deploys:
//   - Azure Container Apps Environment (for Portfolio.Api)
//   - Azure Container App (portfolio-api)
//   - Azure Static Web App (portfolio-ui / Angular)
//   - Azure Log Analytics workspace
// ================================================================

targetScope = 'resourceGroup'

@description('Environment name (dev / prod)')
param environmentName string = 'prod'

@description('Azure region')
param location string = resourceGroup().location

@description('Container image tag for the API (e.g. ghcr.io/youruser/portfolio-api:latest)')
param apiImageTag string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

var prefix = 'portfolio-${environmentName}'

// ── Log Analytics ─────────────────────────────────────────────────
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${prefix}-logs'
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

// ── Container Apps Environment ─────────────────────────────────────
resource caEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${prefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// ── Portfolio API Container App ────────────────────────────────────
resource apiApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${prefix}-api'
  location: location
  properties: {
    managedEnvironmentId: caEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'http'
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'OPTIONS']
          allowedHeaders: ['*']
        }
      }
    }
    template: {
      containers: [
        {
          name: 'portfolio-api'
          image: apiImageTag
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Production'
            }
            {
              name: 'ASPNETCORE_URLS'
              value: 'http://+:8080'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: { metadata: { concurrentRequests: '20' } }
          }
        ]
      }
    }
  }
}

// ── Static Web App (Angular frontend) ─────────────────────────────
resource swa 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${prefix}-ui'
  location: location // SWA supports limited regions — adjust if needed
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
  }
}

// ── Outputs ────────────────────────────────────────────────────────
output apiUrl    string = 'https://${apiApp.properties.configuration.ingress.fqdn}'
output swaUrl    string = 'https://${swa.properties.defaultHostname}'
output swaToken  string = swa.listSecrets().properties.apiKey
