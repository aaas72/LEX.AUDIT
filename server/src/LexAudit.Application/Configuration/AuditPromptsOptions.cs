namespace LexAudit.Application.Configuration;

public class AuditPromptsOptions
{
    public const string SectionName = "AuditPrompts";

    public string HolisticRiskSystemInstruction { get; set; } = string.Empty;
    public string DeepLegalReasonerSystemInstruction { get; set; } = string.Empty;
    public string DeepLegalReasonerPromptTemplate { get; set; } = string.Empty;
    public string RemediationAgentSystemInstruction { get; set; } = string.Empty;
    public string RemediationAgentPromptTemplate { get; set; } = string.Empty;
}
