using System;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage0_GatekeeperValidator
{
    // In a real implementation, we would inject the SubscriptionService and PdfExtractorService here
    // For now, we stub it out based on the plan.

    public async Task<(bool isValid, string errorMessage)> ValidateAsync(Contract contract, CancellationToken ct)
    {
        // 1. Check Magic Bytes and Size (Mocked)
        if (contract.PageCount == 0)
        {
            return (false, "الملف المرفق فارغ أو معطوب.");
        }

        // 2. Check Subscription Quota (Mocked)
        var maxPagesAllowed = contract.User?.CurrentPlan switch
        {
            Domain.Enums.SubscriptionPlan.Free => 3,
            Domain.Enums.SubscriptionPlan.Pro => 15,
            Domain.Enums.SubscriptionPlan.Agency => 30,
            Domain.Enums.SubscriptionPlan.Enterprise => int.MaxValue,
            _ => 0
        };

        if (contract.PageCount > maxPagesAllowed)
        {
            return (false, $"خطة الاشتراك الحالية لا تسمح بفحص عقود تتجاوز {maxPagesAllowed} صفحة. الرجاء الترقية.");
        }

        // 3. PdfPig Heuristics & 4. Gemini Flash (Mocked as successful for scaffolding)
        await Task.Delay(100, ct);

        return (true, string.Empty);
    }
}
