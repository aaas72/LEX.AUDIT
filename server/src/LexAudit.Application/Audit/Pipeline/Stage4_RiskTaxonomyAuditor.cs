using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage4_RiskTaxonomyAuditor
{
    public async Task AuditRisksAsync(List<AuditFinding> findings, UserRole userRole, CancellationToken ct)
    {
        // Deterministic Risk Assessment based on role.
        // Example: High Liability Cap is GOOD for ServiceProvider but BAD for Client.
        foreach (var finding in findings)
        {
            ct.ThrowIfCancellationRequested();

            if (finding.Category == ClauseCategory.LiabilityCap)
            {
                if (userRole == UserRole.Client)
                {
                    finding.RiskLevel = RiskLevel.High;
                    finding.RiskTitle = "Uncapped Liability Exposure";
                    finding.ReasoningText = "As a client, allowing the service provider to limit their liability exposes you to high risk in case of a breach.";
                    finding.ImpactScore = 8;
                }
                else
                {
                    finding.RiskLevel = RiskLevel.Low;
                    finding.RiskTitle = "Standard Liability Cap";
                    finding.ReasoningText = "The liability cap protects your business from catastrophic claims.";
                    finding.ImpactScore = 2;
                }
            }
            
            await Task.Yield();
        }
    }
}
