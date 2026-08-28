using System;
using LexAudit.Domain.Enums;

namespace LexAudit.Application.DTOs;

public class ContractSummaryDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string RiskLevel { get; set; } = string.Empty;
    public int OverallRiskScore { get; set; }
}

public class ContractDetailDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public UserRole UserPartyRole { get; set; }
    public AuditReportDto? Report { get; set; }
}

public class AuditReportDto
{
    public Guid Id { get; set; }
    public AuditStatus Status { get; set; }
    public RiskLevel RiskClassification { get; set; }
    public int OverallRiskScore { get; set; }
    public string ExecutiveSummary { get; set; } = string.Empty;
    public object Findings { get; set; } = new(); // Simplification for now
}
