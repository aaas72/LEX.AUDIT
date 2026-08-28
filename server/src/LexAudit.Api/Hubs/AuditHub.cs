using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace LexAudit.Api.Hubs;

public class AuditHub : Hub
{
    // Clients connect and join a group based on their ContractId
    public async Task JoinContractGroup(string contractId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, contractId);
        await Clients.Caller.SendAsync("JoinedGroup", contractId);
    }

    public async Task LeaveContractGroup(string contractId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, contractId);
    }
}
