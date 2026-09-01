using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using Microsoft.Extensions.Options;
using LexAudit.Application.Interfaces;
using LexAudit.Application.Configuration;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage5_DeepLegalReasoner
{
    private readonly IGeminiProvider _geminiProvider;
    private readonly AuditPromptsOptions _prompts;

    public Stage5_DeepLegalReasoner(IGeminiProvider geminiProvider, IOptions<AuditPromptsOptions> options)
    {
        _geminiProvider = geminiProvider;
        _prompts = options.Value;
    }

    public async Task ReasonOverFindingsAsync(List<AuditFinding> findings, UserRole role, string language, string apiKey, CancellationToken ct)
    {
        // Only run deep reasoning on Medium or higher risk clauses to save tokens
        var highRiskFindings = findings.Where(f => f.RiskLevel >= RiskLevel.Medium).ToList();

        foreach (var finding in highRiskFindings)
        {
            ct.ThrowIfCancellationRequested();

            var prompt = string.Format(_prompts.DeepLegalReasonerPromptTemplate, role, finding.VerbatimQuote, finding.Category, finding.RiskLevel, language);
            var systemInstruction = _prompts.DeepLegalReasonerSystemInstruction;
            
            try 
            {
                var worstCase = await _geminiProvider.GenerateContentAsync(systemInstruction, prompt, apiKey, ct);
                finding.WorstCaseScenario = worstCase;
            }
            catch (Exception)
            {
                finding.WorstCaseScenario = "Analysis unavailable due to AI service timeout.";
            }
        }
    }
}
