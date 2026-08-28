namespace LexAudit.Domain.ValueObjects;

public record RedlineAlternative
{
    public string Level { get; init; } = string.Empty; // e.g., AGGRESSIVE, BALANCED, MINIMUM
    public string Label { get; init; } = string.Empty;
    public string RedlinedText { get; init; } = string.Empty;
    public string Justification { get; init; } = string.Empty;
}
