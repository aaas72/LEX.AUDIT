using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Text.Json;
using LexAudit.Domain.Entities;
using LexAudit.Application.Interfaces;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage0_GatekeeperValidator
{
    private readonly IPdfExtractor _pdfExtractor;
    private readonly IGeminiProvider _geminiProvider;

    public Stage0_GatekeeperValidator(IPdfExtractor pdfExtractor, IGeminiProvider geminiProvider)
    {
        _pdfExtractor = pdfExtractor;
        _geminiProvider = geminiProvider;
    }

    public async Task<(bool isValid, string errorMessage)> ValidateAsync(Contract contract, Stream fileStream, CancellationToken ct)
    {
        // 1. Check Heuristics (Size and Text)
        var (isText, pageCount) = _pdfExtractor.ExtractHeuristics(fileStream);
        if (pageCount == 0)
        {
            return (false, "الملف المرفق فارغ أو معطوب.");
        }
        
        contract.PageCount = pageCount; // Update entity count

        if (!isText)
        {
            return (false, "الملف عبارة عن صورة أو مستند ممسوح ضوئياً غير قابل للقراءة. الرجاء رفع عقد نصي.");
        }

        // 2. Quota Check Removed (BYOK)
        // No page limits when using Bring Your Own Key.

        // 3. Gemini Gatekeeper (AI Validation)
        var paragraphs = await _pdfExtractor.ExtractParagraphsAsync(fileStream, ct);
        var sampleText = string.Join("\n\n", paragraphs.Take(5)); 
        
        if (string.IsNullOrWhiteSpace(sampleText))
        {
             return (false, "لم يتم العثور على أي نصوص في الصفحات الأولى من هذا الملف.");
        }

        var systemPrompt = @"You are a strict Gatekeeper for a legal contract auditing system.
Your job is to determine if the provided text looks like a legal contract, agreement, Terms of Service, Privacy Policy, or NDA.
If the text is obviously a cooking recipe, a casual letter, a random article, or a non-legal document, you must reject it.
Respond STRICTLY in JSON format:
{
  ""isContract"": true or false,
  ""reason"": ""If false, explain in Arabic why this document is rejected. If true, leave empty.""
}";

        var apiKey = contract.User?.GeminiApiKey ?? string.Empty;
        var response = await _geminiProvider.GenerateContentAsync(systemPrompt, sampleText, apiKey, ct);
        
        try 
        {
            // Clean up potential markdown formatting from Gemini
            var jsonStr = response.Trim();
            if (jsonStr.StartsWith("```json")) jsonStr = jsonStr.Substring(7);
            if (jsonStr.StartsWith("```")) jsonStr = jsonStr.Substring(3);
            if (jsonStr.EndsWith("```")) jsonStr = jsonStr.Substring(0, jsonStr.Length - 3);
            
            var result = JsonSerializer.Deserialize<GatekeeperResult>(jsonStr, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            if (result != null && !result.IsContract)
            {
                return (false, result.Reason ?? "تم رفض الملف لأن الذكاء الاصطناعي لم يتمكن من التعرف عليه كعقد قانوني.");
            }
        }
        catch 
        {
            // Ignore JSON parse errors for now to not block legitimate contracts
        }

        return (true, string.Empty);
    }
    
    private class GatekeeperResult 
    {
        public bool IsContract { get; set; }
        public string? Reason { get; set; }
    }
}
