using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using LexAudit.Application.Interfaces;
using LexAudit.Api.Hubs;

namespace LexAudit.Api.Services;

public class SignalRAuditProgressNotifier : IAuditProgressNotifier
{
    private readonly IHubContext<AuditHub> _hubContext;

    public SignalRAuditProgressNotifier(IHubContext<AuditHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyStageCompleteAsync(string contractId, string stageName, int progressPercentage, CancellationToken ct)
    {
        await _hubContext.Clients.Group(contractId).SendAsync("ReceiveProgress", new
        {
            Stage = stageName,
            Percentage = progressPercentage
        }, ct);
    }

    public async Task NotifyErrorAsync(string contractId, string errorMessage, CancellationToken ct)
    {
        await _hubContext.Clients.Group(contractId).SendAsync("ReceiveError", errorMessage, ct);
    }
}
