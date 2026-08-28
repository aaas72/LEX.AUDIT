using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage3_ClauseClassifier
{
    public async Task ClassifyClausesAsync(List<AuditFinding> findings, string language, CancellationToken ct)
    {
        // In full implementation, this uses Gemini to classify clauses.
        // Mocking for now:
        foreach (var finding in findings)
        {
            ct.ThrowIfCancellationRequested();
            
            var text = finding.VerbatimQuote.ToLower();
            if (text.Contains("liability") || text.Contains("مسؤولية") || text.Contains("sorumluluk"))
            {
                finding.Category = ClauseCategory.LiabilityCap;
            }
            else if (text.Contains("terminate") || text.Contains("فسخ") || text.Contains("fesih"))
            {
                finding.Category = ClauseCategory.Termination;
            }
            else if (text.Contains("confidential") || text.Contains("سرية") || text.Contains("gizli"))
            {
                finding.Category = ClauseCategory.Confidentiality;
            }
            
            await Task.Yield();
        }
    }
}
