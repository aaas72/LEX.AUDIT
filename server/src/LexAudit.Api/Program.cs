using LexAudit.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
// Load environment variables from .env file
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // needed for SignalR/cookies if any
        });
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT Secret is missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LexAudit";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LexAuditClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret))
        };
        // Configure SignalR Auth
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/audit"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

// Register Configuration
builder.Services.Configure<LexAudit.Application.Configuration.AuditPromptsOptions>(
    builder.Configuration.GetSection(LexAudit.Application.Configuration.AuditPromptsOptions.SectionName));

// Register Application Services
builder.Services.AddHttpClient();
builder.Services.AddScoped<LexAudit.Application.Interfaces.IGeminiProvider, LexAudit.Infrastructure.Services.GeminiProvider>();
builder.Services.AddScoped<LexAudit.Application.Interfaces.IPdfExtractor, LexAudit.Infrastructure.Services.PdfExtractorService>();
builder.Services.AddScoped<LexAudit.Application.Interfaces.IAuditProgressNotifier, LexAudit.Api.Services.SignalRAuditProgressNotifier>();
builder.Services.AddScoped<LexAudit.Application.Audit.AuditOrchestrator>();

builder.Services.AddScoped<LexAudit.Application.Interfaces.ITokenService, LexAudit.Infrastructure.Services.JwtTokenService>();
builder.Services.AddScoped<LexAudit.Application.Interfaces.IEmailService, LexAudit.Infrastructure.Services.MockEmailService>();
builder.Services.AddScoped<LexAudit.Application.Interfaces.IAuthService, LexAudit.Infrastructure.Services.AuthService>();

// Configure SQLite DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=lexaudit.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<LexAudit.Api.Hubs.AuditHub>("/hubs/audit");

app.Run();
