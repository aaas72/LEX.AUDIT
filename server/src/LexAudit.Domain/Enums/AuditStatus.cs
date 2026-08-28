namespace LexAudit.Domain.Enums;

public enum AuditStatus
{
    Pending = 0,
    Extracting = 1,
    Classifying = 2,
    Analyzing = 3,
    Finalizing = 4,
    Completed = 5,
    Failed = 6
}
