using LexAudit.Domain.Enums;
using LexAudit.Domain.Entities;

namespace LexAudit.Infrastructure.Services;

public class SubscriptionService
{
    public bool ValidateQuota(SubscriptionPlan plan, int pageCount)
    {
        return plan switch
        {
            SubscriptionPlan.Free => pageCount <= 3,
            SubscriptionPlan.Pro => pageCount <= 15,
            SubscriptionPlan.Agency => pageCount <= 30,
            SubscriptionPlan.Enterprise => true,
            _ => false
        };
    }
}
