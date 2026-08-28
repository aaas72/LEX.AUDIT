using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage2_DocumentGraphBuilder
{
    public async Task<List<AuditFinding>> BuildGraphAsync(Contract contract, List<string> paragraphs, CancellationToken ct)
    {
        var findings = new List<AuditFinding>();
        
        // MVP: Just wrap each paragraph into a "Finding" object with an initial "Unknown" category
        for (int i = 0; i < paragraphs.Count; i++)
        {
            ct.ThrowIfCancellationRequested();
            
            findings.Add(new AuditFinding
            {
                Id = Guid.NewGuid(),
                ClauseId = $"C{i + 1:D3}",
                VerbatimQuote = paragraphs[i],
                Category = Domain.Enums.ClauseCategory.Unknown
            });
        }
        
        await Task.Yield();
        return findings;
    }
}
