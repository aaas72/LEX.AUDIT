using System.Threading;
using System.Threading.Tasks;

namespace LexAudit.Application.Interfaces;

public interface IGeminiProvider
{
    /// <summary>
    /// Sends a prompt to Gemini 2.5 Pro/Flash and returns the response as a string.
    /// Used for complex legal reasoning and redlining.
    /// </summary>
    Task<string> GenerateContentAsync(string systemInstruction, string userPrompt, string apiKey, CancellationToken ct);
    
    /// <summary>
    /// Analyzes the entire document graph via Gemini 2.5 Pro for holistic inconsistencies.
    /// </summary>
    Task<string> AnalyzeHolisticRiskAsync(string contractText, string userRole, string language, string apiKey, CancellationToken ct);

    /// <summary>
    /// Validates the provided Gemini API key by making a lightweight API call.
    /// </summary>
    Task<bool> ValidateApiKeyAsync(string apiKey, CancellationToken ct);
}
