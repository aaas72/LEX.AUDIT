using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using LexAudit.Application.Interfaces;
using LexAudit.Application.Configuration;

namespace LexAudit.Infrastructure.Services;

public class GeminiProvider : IGeminiProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly AuditPromptsOptions _prompts;

    public GeminiProvider(HttpClient httpClient, IConfiguration config, IOptions<AuditPromptsOptions> options)
    {
        _httpClient = httpClient;
        _apiKey = config["Gemini:ApiKey"] ?? string.Empty;
        _baseUrl = config["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=";
        _prompts = options.Value;
    }

    public async Task<string> GenerateContentAsync(string systemInstruction, string userPrompt, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            // Fallback for development if no key is set
            return "{\"mock_response\": \"Gemini API Key missing, returning mock data.\"}";
        }

        var requestUri = $"{_baseUrl}{_apiKey}";
        
        var payload = new
        {
            system_instruction = new { parts = new[] { new { text = systemInstruction } } },
            contents = new[] { new { parts = new[] { new { text = userPrompt } } } },
            generationConfig = new { response_mime_type = "application/json" }
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(requestUri, content, ct);
        
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync(ct);
            throw new Exception($"Gemini API Error: {err}");
        }

        var responseJson = await response.Content.ReadAsStringAsync(ct);
        
        // Parse the Gemini Response structure (simplified)
        using var doc = JsonDocument.Parse(responseJson);
        var textResult = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text").GetString();

        return textResult ?? string.Empty;
    }

    public async Task<string> AnalyzeHolisticRiskAsync(string contractText, string userRole, string language, CancellationToken ct)
    {
        var systemInstruction = string.Format(_prompts.HolisticRiskSystemInstruction, userRole, language);
        return await GenerateContentAsync(systemInstruction, contractText, ct);
    }
}
