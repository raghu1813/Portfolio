using Azure.Communication.Email;
using Portfolio.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PortfolioPolicy", policy =>
        policy.WithOrigins(
                "http://localhost:4200",
                "https://red-stone-043bae800.4.azurestaticapps.net",
                "https://portfolio.raghuram.dev",
                "https://*.azurestaticapps.net"
              )
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.MapHealthChecks("/health");

app.UseCors("PortfolioPolicy");

// ─── Portfolio Data ───────────────────────────────────────────────
app.MapGet("/api/portfolio", () =>
{
    var data = new PortfolioData(
        Person: new PersonInfo(
            Name: "Raghuram Kaligotla",
            Title: "Full Stack Developer",
            Location: "Hyderabad, Telangana",
            Email: "raghurm.kaligotla@gmail.com",
            Phone: "+91 9553663307",
            LinkedInUrl: "https://www.linkedin.com/in/raghu-ram-kaligotla/",
            GitHubUrl: "https://github.com/raghu1813",
            Summary: "Results-driven Full Stack Developer with nearly 6 years of experience engineering scalable enterprise applications using C#, .NET, Angular, and Azure. Proven track record at global leaders like Deloitte and ADP, specializing in robust financial systems, tax optimization software, and integrating generative AI to modernize database interactions."
        ),
        Skills:
        [
            new Skill("Languages",         ["C#", "Python"]),
            new Skill("Frontend",          ["Angular", "TypeScript", "HTML5", "CSS3"]),
            new Skill("Backend",           [".NET", "ASP.NET Core", "Web API", "Azure SQL"]),
            new Skill("Cloud & DevOps",    ["Azure App Services", "Azure Function Apps", "Azure Service Bus", "Azure Batch Service", "Azure Key Vault", "Docker", "Git"]),
            new Skill("AI & Applied Tech", ["Large Language Models (LLMs)", "Generative AI", "Natural Language to SQL"]),
            new Skill("Reporting",         ["Power BI"]),
        ],
        Experiences:
        [
            new Experience(
                Company: "Deloitte",
                Role: "Full Stack Developer",
                Period: "Oct 2020 – Dec 2023",
                Highlights:
                [
                    "Engineered the Integrated International Tax Reform (IITR) web application using .NET and Angular, modernizing and replacing highly manual, Excel-based tax workflows.",
                    "Slashed IITR calculation processing time from 12 hours down to just 5 minutes by implementing backend optimizations and distributing workloads via Azure Batch Service.",
                    "Architected a plug-and-play natural language AI accelerator utilizing LLMs, designed for seamless integration across multiple applications.",
                    "Empowered non-technical business users by enabling the AI bot to dynamically translate natural language into complex SQL for instant, code-free data retrieval.",
                    "Optimized the Upstream Tax Analyzer (UTA) by replacing a legacy SQL broker-based system with Azure Service Bus, enhancing performance and message processing speeds.",
                ]
            ),
            new Experience(
                Company: "ADP",
                Role: "Full Stack Developer",
                Period: "2016 – 2020",
                Highlights:
                [
                    "Spearheaded the end-to-end development of an in-house Expense Management system, architecting the .NET backend and Angular frontend from scratch.",
                    "Automated expense reporting by integrating receipt-reading capabilities, eliminating manual data entry through automatic extraction and form population.",
                    "Delivered continuous feature developments for enterprise-scale Payroll and Fleet Management modules.",
                    "Collaborated across cross-functional teams to ensure high availability, security, and performance of critical internal tools.",
                ]
            ),
        ],
        Educations:
        [
            new Education(
                Institution: "National Institute of Technology (NIT) Andhra Pradesh",
                Degree: "B.Tech in Computer Science and Engineering (CSE)",
                Years: "2012 – 2016"
            ),
        ],
        Certifications:
        [
            new Certification("Microsoft Certified: Azure AI Engineer Associate", "AI-102"),
            new Certification("Microsoft Certified: Azure Developer Associate",   "AZ-204"),
            new Certification("Microsoft Certified: Azure AI Fundamentals",       "AI-900"),
            new Certification("Microsoft Certified: Azure Fundamentals",          "AZ-900"),
            new Certification("GitHub Copilot",                                   "GH-300"),
        ]
    );

    return Results.Ok(data);
})
.WithName("GetPortfolio");

// ─── Contact Form ─────────────────────────────────────────────────
app.MapPost("/api/contact", async (ContactRequest request, IConfiguration config, ILogger<Program> logger) =>
{
    var connectionString = config["ACS_CONNECTION_STRING"] ?? config["AzureCommunicationServices:ConnectionString"];
    EmailClient? emailClient = string.IsNullOrWhiteSpace(connectionString) ? null : new EmailClient(connectionString);

    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Message))
    {
        return Results.BadRequest(new ContactResponse(false, "Name, email, and message are required."));
    }

    if (emailClient is null)
    {
        logger.LogWarning("ACS not configured — contact form submission from {Email} dropped.", request.Email);
        return Results.Ok(new ContactResponse(false, "Email service not configured. Please email raghurm.kaligotla@gmail.com directly."));
    }

    var senderAddress = config["ACS_SENDER_ADDRESS"]
                     ?? config["AzureCommunicationServices:SenderAddress"]
                     ?? throw new InvalidOperationException("ACS sender address is not configured.");
    const string ownerEmail = "raghurm.kaligotla@gmail.com";

    var subject = string.IsNullOrWhiteSpace(request.Subject)
        ? $"Portfolio contact from {request.Name}"
        : $"Portfolio: {request.Subject}";

    var htmlBody = $"""
        <html><body style="font-family:sans-serif;color:#1e293b;padding:24px">
          <h2 style="color:#0891b2">New Portfolio Contact</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold;width:120px">Name</td>
                <td style="padding:8px">{System.Net.WebUtility.HtmlEncode(request.Name)}</td></tr>
            <tr style="background:#f1f5f9">
                <td style="padding:8px;font-weight:bold">Email</td>
                <td style="padding:8px"><a href="mailto:{System.Net.WebUtility.HtmlEncode(request.Email)}">{System.Net.WebUtility.HtmlEncode(request.Email)}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Subject</td>
                <td style="padding:8px">{System.Net.WebUtility.HtmlEncode(request.Subject ?? "(none)")}</td></tr>
            <tr style="background:#f1f5f9">
                <td style="padding:8px;font-weight:bold;vertical-align:top">Message</td>
                <td style="padding:8px;white-space:pre-wrap">{System.Net.WebUtility.HtmlEncode(request.Message)}</td></tr>
          </table>
        </body></html>
        """;

    var emailMessage = new EmailMessage(
        senderAddress: senderAddress,
        recipients: new EmailRecipients([new EmailAddress(ownerEmail, "Raghuram Kaligotla")]),
        content: new EmailContent(subject)
        {
            Html = htmlBody,
            PlainText = $"From: {request.Name} <{request.Email}>\nSubject: {request.Subject}\n\n{request.Message}"
        }
    );

    emailMessage.ReplyTo.Add(new EmailAddress(request.Email, request.Name));

    try
    {
        var sendOperation = await emailClient.SendAsync(Azure.WaitUntil.Completed, emailMessage);
        var status = sendOperation.Value.Status;

        if (status == EmailSendStatus.Succeeded)
        {
            return Results.Ok(new ContactResponse(true, "Thanks for reaching out! I'll get back to you soon."));
        }

        logger.LogWarning("ACS email send completed with non-success status: {Status}", status);
        return Results.Ok(new ContactResponse(false, $"Email delivery status: {status}. Please try again or email me directly."));
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to send contact email via ACS");
        return Results.Ok(new ContactResponse(false, $"Could not send email: {ex.Message}"));
    }
})
.WithName("SendContact");

app.Run();
