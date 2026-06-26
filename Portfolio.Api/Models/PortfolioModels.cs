namespace Portfolio.Api.Models;

public record PersonInfo(
    string Name,
    string Title,
    string Location,
    string Email,
    string Phone,
    string LinkedInUrl,
    string GitHubUrl,
    string Summary
);

public record Skill(string Category, string[] Items);

public record Experience(
    string Company,
    string Role,
    string Period,
    string[] Highlights
);

public record Education(
    string Institution,
    string Degree,
    string Years
);

public record Certification(string Name, string Code);

public record PortfolioData(
    PersonInfo Person,
    Skill[] Skills,
    Experience[] Experiences,
    Education[] Educations,
    Certification[] Certifications
);

public record ContactRequest(string Name, string Email, string Subject, string Message);
public record ContactResponse(bool Success, string Message);
