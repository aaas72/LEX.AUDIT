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

public class Stage6_RemediationAgent
{
    private readonly IGeminiProvider _geminiProvider;
    private readonly AuditPromptsOptions _prompts;

    public Stage6_RemediationAgent(IGeminiProvider geminiProvider, IOptions<AuditPromptsOptions> options)
    {
        _geminiProvider = geminiProvider;
        _prompts = options.Value;
    }

    public async Task GenerateAlternativesAsync(List<AuditFinding> findings, UserRole role, string language, CancellationToken ct)
    {
        // Only run remediation on high-risk clauses
        var highRiskFindings = findings.Where(f => f.RiskLevel == RiskLevel.High || f.RiskLevel == RiskLevel.Critical).ToList();

        foreach (var finding in highRiskFindings)
        {
            ct.ThrowIfCancellationRequested();

            var prompt = string.Format(_prompts.RemediationAgentPromptTemplate, role, finding.VerbatimQuote, language);

            try 
            {
                var alternativesJson = await _geminiProvider.GenerateContentAsync(_prompts.RemediationAgentSystemInstruction, prompt, ct);
                
                // Clean markdown if Gemini accidentally adds it
                alternativesJson = alternativesJson.Replace("```json", "").Replace("```", "").Trim();
                
                finding.AlternativesJson = alternativesJson;
            }
            catch (Exception)
            {
                finding.AlternativesJson = "[]";
            }
        }
    }
}
