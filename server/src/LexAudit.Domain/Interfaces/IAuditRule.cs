using LexAudit.Domain.Entities;

namespace LexAudit.Domain.Interfaces;

public interface IAuditRule
{
    /// <summary>
    /// Executes a deterministic (non-LLM) rule check on the extracted clauses.
    /// Used in Stage 4 of the pipeline.
    /// </summary>
    void Evaluate(AuditReport report, Contract contractData);
}
