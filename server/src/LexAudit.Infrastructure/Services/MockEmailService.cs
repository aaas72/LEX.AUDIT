using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using LexAudit.Application.Interfaces;

namespace LexAudit.Infrastructure.Services;

public class MockEmailService : IEmailService
{
    private readonly ILogger<MockEmailService> _logger;

    public MockEmailService(ILogger<MockEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body)
    {
        _logger.LogInformation("================== MOCK EMAIL ==================");
        _logger.LogInformation("TO: {To}", to);
        _logger.LogInformation("SUBJECT: {Subject}", subject);
        _logger.LogInformation("BODY:\n{Body}", body);
        _logger.LogInformation("================================================");
        
        return Task.CompletedTask;
    }
}
