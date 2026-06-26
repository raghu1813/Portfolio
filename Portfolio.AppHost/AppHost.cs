var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.Portfolio_Api>("portfolio-api")
    .WithExternalHttpEndpoints();

builder.Build().Run();
