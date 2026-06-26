import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ContactRequest, ContactResponse, PortfolioData } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(`${this.base}/api/portfolio`).pipe(
      catchError(() => of(this.getFallbackData()))
    );
  }

  sendContact(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.base}/api/contact`, request);
  }

  /** Fallback static data if API is unreachable */
  private getFallbackData(): PortfolioData {
    return {
      person: {
        name: 'Raghuram Kaligotla',
        title: 'Full Stack Developer',
        location: 'Hyderabad, Telangana',
        email: 'raghurm.kaligotla@gmail.com',
        phone: '+91 9553663307',
        linkedInUrl: 'https://www.linkedin.com/in/raghu-ram-kaligotla/',
        gitHubUrl: 'https://github.com/raghu1813',
        summary:
          'Results-driven Full Stack Developer with nearly 6 years of experience engineering scalable enterprise applications using C#, .NET, Angular, and Azure. Proven track record at global leaders like Deloitte and ADP, specializing in robust financial systems, tax optimization software, and integrating generative AI to modernize database interactions.'
      },
      skills: [
        { category: 'Languages',         items: ['C#', 'Python'] },
        { category: 'Frontend',          items: ['Angular', 'TypeScript', 'HTML5', 'CSS3'] },
        { category: 'Backend',           items: ['.NET', 'ASP.NET Core', 'Web API', 'Azure SQL'] },
        { category: 'Cloud & DevOps',    items: ['Azure App Services', 'Azure Function Apps', 'Azure Service Bus', 'Azure Batch Service', 'Azure Key Vault', 'Docker', 'Git'] },
        { category: 'AI & Applied Tech', items: ['Large Language Models (LLMs)', 'Generative AI', 'Natural Language to SQL'] },
        { category: 'Reporting',         items: ['Power BI'] }
      ],
      experiences: [
        {
          company: 'Deloitte',
          role: 'Full Stack Developer',
          period: 'Oct 2020 – Dec 2023',
          highlights: [
            'Engineered the Integrated International Tax Reform (IITR) web application using .NET and Angular, modernizing Excel-based tax workflows.',
            'Slashed IITR calculation processing time from 12 hours down to just 5 minutes via Azure Batch Service.',
            'Architected a plug-and-play natural language AI accelerator utilizing LLMs for seamless multi-app integration.',
            'Enabled non-technical users to translate natural language into complex SQL for instant data retrieval.',
            'Optimized the Upstream Tax Analyzer by replacing legacy SQL broker with Azure Service Bus.'
          ]
        },
        {
          company: 'ADP',
          role: 'Full Stack Developer',
          period: '2016 – 2020',
          highlights: [
            'Spearheaded end-to-end development of an in-house Expense Management system from scratch.',
            'Automated expense reporting with receipt-reading capabilities, eliminating manual data entry.',
            'Delivered continuous feature developments for enterprise-scale Payroll and Fleet Management modules.',
            'Ensured high availability, security, and performance of critical internal tools across cross-functional teams.'
          ]
        }
      ],
      educations: [
        {
          institution: 'National Institute of Technology (NIT) Andhra Pradesh',
          degree: 'B.Tech in Computer Science and Engineering (CSE)',
          years: '2012 – 2016'
        }
      ],
      certifications: [
        { name: 'Microsoft Certified: Azure AI Engineer Associate', code: 'AI-102' },
        { name: 'Microsoft Certified: Azure Developer Associate',   code: 'AZ-204' },
        { name: 'Microsoft Certified: Azure AI Fundamentals',       code: 'AI-900' },
        { name: 'Microsoft Certified: Azure Fundamentals',          code: 'AZ-900' },
        { name: 'GitHub Copilot',                                   code: 'GH-300' }
      ]
    };
  }
}
