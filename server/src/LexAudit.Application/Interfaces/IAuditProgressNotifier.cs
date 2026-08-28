using System.Threading;
using System.Threading.Tasks;

namespace LexAudit.Application.Interfaces;

public interface IAuditProgressNotifier
{
    /// <summary>
    /// Notifies clients about the progress of the audit pipeline.
    /// </summary>
    Task NotifyStageCompleteAsync(string contractId, string stageName, int progressPercentage, CancellationToken ct);
    
    /// <summary>
    /// Sends an error message to the client.
    /// </summary>
    Task NotifyErrorAsync(string contractId, string errorMessage, CancellationToken ct);
}
