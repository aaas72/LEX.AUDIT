using System;
using System.Collections.Generic;
using LexAudit.Domain.Enums;
using LexAudit.Domain.ValueObjects;

namespace LexAudit.Domain.Entities;

public class AuditFinding
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid AuditReportId { get; set; }
    public AuditReport AuditReport { get; set; } = null!;
    
    public string ClauseId { get; set; } = string.Empty;
    public ClauseCategory Category { get; set; } = ClauseCategory.Unknown;
    
    public string VerbatimQuote { get; set; } = string.Empty;
    public string RiskTitle { get; set; } = string.Empty;
    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
    
    // Scores from 0-10
    public int AsymmetryScore { get; set; } = 0;
    public int MarketDeviationScore { get; set; } = 0;
    public int ImpactScore { get; set; } = 0;
    
    // AI Reasoning
    public string ReasoningText { get; set; } = string.Empty;
    public string WorstCaseScenario { get; set; } = string.Empty;
    
    // JSON stored as string for simplicity in SQLite, could use owned types
    // Format: List of RedlineAlternative
    public string AlternativesJson { get; set; } = "[]";
}
