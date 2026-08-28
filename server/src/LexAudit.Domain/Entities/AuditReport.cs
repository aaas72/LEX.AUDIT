using System;
using System.Collections.Generic;
using LexAudit.Domain.Enums;

namespace LexAudit.Domain.Entities;

public class AuditReport
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ContractId { get; set; }
    public Contract Contract { get; set; } = null!;
    
    public string Language { get; set; } = "en"; // ar, en, tr (From Accept-Language)
    public string InferredContractType { get; set; } = string.Empty; // Inferred by AI
    public string InferredIndustry { get; set; } = string.Empty; // Inferred by AI
    
    public AuditStatus Status { get; set; } = AuditStatus.Pending;
    public string ErrorMessage { get; set; } = string.Empty;
    
    // Stats
    public int TotalClauses { get; set; } = 0;
    public int AnalyzedClauses { get; set; } = 0;
    public int FlaggedFindings { get; set; } = 0;
    
    // Scoring
    public int OverallRiskScore { get; set; } = 0; // 0-100
    public RiskLevel RiskClassification { get; set; } = RiskLevel.Low;
    
    public string ExecutiveSummary { get; set; } = string.Empty;
    public DateTime CompletedAt { get; set; }
    
    // Navigation
    public ICollection<AuditFinding> Findings { get; set; } = new List<AuditFinding>();
}
