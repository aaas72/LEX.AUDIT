using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using LexAudit.Application.Interfaces;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage8_ReportAssembler
{
    private readonly IGeminiProvider _geminiProvider;

    public Stage8_ReportAssembler(IGeminiProvider geminiProvider)
    {
        _geminiProvider = geminiProvider;
    }

    public async Task AssembleReportAsync(AuditReport report, string fullContractText, UserRole role, string apiKey, CancellationToken ct)
    {
        report.AnalyzedClauses = report.Findings.Count;
        report.FlaggedFindings = report.Findings.Count(f => f.RiskLevel >= RiskLevel.Medium);
        
        // Calculate overall score (simplified)
        var criticalCount = report.Findings.Count(f => f.RiskLevel == RiskLevel.Critical);
        var highCount = report.Findings.Count(f => f.RiskLevel == RiskLevel.High);
        var mediumCount = report.Findings.Count(f => f.RiskLevel == RiskLevel.Medium);
        
        int riskScore = (criticalCount * 25) + (highCount * 10) + (mediumCount * 5);
        report.OverallRiskScore = Math.Min(100, riskScore);
        
        if (report.OverallRiskScore > 75) report.RiskClassification = RiskLevel.Critical;
        else if (report.OverallRiskScore > 50) report.RiskClassification = RiskLevel.High;
        else if (report.OverallRiskScore > 25) report.RiskClassification = RiskLevel.Medium;
        else report.RiskClassification = RiskLevel.Low;

        try
        {
            // Call Gemini for holistic risk and executive summary
            var holisticResponse = await _geminiProvider.AnalyzeHolisticRiskAsync(fullContractText, role.ToString(), report.Language, apiKey, ct);
            report.ExecutiveSummary = holisticResponse;
        }
        catch (Exception)
        {
            report.ExecutiveSummary = "Executive summary generation failed due to API limits.";
        }
    }
}
