using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using Microsoft.Extensions.Options;
using LexAudit.Application.Audit.Pipeline;
using LexAudit.Application.Interfaces;
using LexAudit.Application.Configuration;

namespace LexAudit.Application.Audit;

public class AuditOrchestrator
{
    private readonly Stage0_GatekeeperValidator _gatekeeper;
    private readonly Stage1_StructuralExtractor _extractor;
    private readonly Stage2_DocumentGraphBuilder _graphBuilder;
    private readonly Stage3_ClauseClassifier _classifier;
    private readonly Stage4_RiskTaxonomyAuditor _auditor;
    private readonly Stage5_DeepLegalReasoner _reasoner;
    private readonly Stage6_RemediationAgent _remediation;
    private readonly Stage7_GroundingVerifier _verifier;
    private readonly Stage8_ReportAssembler _assembler;
    private readonly IAuditProgressNotifier _notifier;

    public AuditOrchestrator(IPdfExtractor pdfExtractor, IGeminiProvider geminiProvider, IAuditProgressNotifier notifier, IOptions<AuditPromptsOptions> options)
    {
        _gatekeeper = new Stage0_GatekeeperValidator();
        _extractor = new Stage1_StructuralExtractor(pdfExtractor);
        _graphBuilder = new Stage2_DocumentGraphBuilder();
        _classifier = new Stage3_ClauseClassifier();
        _auditor = new Stage4_RiskTaxonomyAuditor();
        _reasoner = new Stage5_DeepLegalReasoner(geminiProvider, options);
        _remediation = new Stage6_RemediationAgent(geminiProvider, options);
        _verifier = new Stage7_GroundingVerifier();
        _assembler = new Stage8_ReportAssembler(geminiProvider);
        _notifier = notifier;
    }

    public async Task<AuditReport> RunAuditAsync(Contract contract, Stream fileStream, string targetLanguage, CancellationToken ct)
    {
        var contractIdStr = contract.Id.ToString();
        var report = new AuditReport 
        { 
            ContractId = contract.Id, 
            Language = targetLanguage,
            Status = AuditStatus.Extracting
        };

        try
        {
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Starting Stage 0: Gatekeeper", 5, ct);
            var (isValid, errorMsg) = await _gatekeeper.ValidateAsync(contract, ct);
            if (!isValid)
            {
                report.Status = AuditStatus.Failed;
                report.ErrorMessage = errorMsg;
                await _notifier.NotifyErrorAsync(contractIdStr, errorMsg, ct);
                return report;
            }

            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 1: Structural Extraction", 15, ct);
            var paragraphs = await _extractor.ExtractParagraphsAsync(contract, fileStream, ct);
            report.TotalClauses = paragraphs.Count;
            
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 2: Graph Builder", 25, ct);
            var findings = await _graphBuilder.BuildGraphAsync(contract, paragraphs, ct);
            
            report.Status = AuditStatus.Classifying;
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 3: Classifier", 40, ct);
            await _classifier.ClassifyClausesAsync(findings, targetLanguage, ct);
            
            report.Status = AuditStatus.Analyzing;
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 4: Risk Auditor", 55, ct);
            await _auditor.AuditRisksAsync(findings, contract.UserPartyRole, ct);
            
            report.Status = AuditStatus.Finalizing;
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 5: Deep Legal Reasoner", 70, ct);
            await _reasoner.ReasonOverFindingsAsync(findings, contract.UserPartyRole, targetLanguage, ct);
            
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 6: Remediation Agent", 85, ct);
            await _remediation.GenerateAlternativesAsync(findings, contract.UserPartyRole, targetLanguage, ct);
            
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 7: Grounding Verifier", 90, ct);
            await _verifier.VerifyGroundingAsync(findings, ct);
            
            report.Findings = findings;
            
            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Stage 8: Report Assembler", 95, ct);
            var fullText = string.Join("\n\n", paragraphs);
            await _assembler.AssembleReportAsync(report, fullText, contract.UserPartyRole, ct);
            
            report.Status = AuditStatus.Completed;
            report.CompletedAt = DateTime.UtcNow;

            await _notifier.NotifyStageCompleteAsync(contractIdStr, "Audit Completed", 100, ct);
        }
        catch (Exception ex)
        {
            report.Status = AuditStatus.Failed;
            report.ErrorMessage = ex.Message;
            await _notifier.NotifyErrorAsync(contractIdStr, "Unexpected Error: " + ex.Message, ct);
        }

        return report;
    }
}
