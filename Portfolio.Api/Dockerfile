FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files
COPY ["Portfolio.Api/Portfolio.Api.csproj", "Portfolio.Api/"]
COPY ["Portfolio.ServiceDefaults/Portfolio.ServiceDefaults.csproj", "Portfolio.ServiceDefaults/"]

RUN dotnet restore "Portfolio.Api/Portfolio.Api.csproj"

# Copy source
COPY . .
WORKDIR "/src/Portfolio.Api"
RUN dotnet build "Portfolio.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Portfolio.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
