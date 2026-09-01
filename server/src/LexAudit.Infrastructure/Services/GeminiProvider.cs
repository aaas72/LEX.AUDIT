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
    private readonly string _baseUrl;
    private readonly AuditPromptsOptions _prompts;

    public GeminiProvider(HttpClient httpClient, IConfiguration config, IOptions<AuditPromptsOptions> options)
    {
        _httpClient = httpClient;
        _baseUrl = config["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=";
        _prompts = options.Value;
    }

    public async Task<string> GenerateContentAsync(string systemInstruction, string userPrompt, string apiKey, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new Exception("Gemini API Key is required.");
        }

        var requestUri = $"{_baseUrl}{apiKey}";
        
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

    public async Task<string> AnalyzeHolisticRiskAsync(string contractText, string userRole, string language, string apiKey, CancellationToken ct)
    {
        var systemInstruction = string.Format(_prompts.HolisticRiskSystemInstruction, userRole, language);
        return await GenerateContentAsync(systemInstruction, contractText, apiKey, ct);
    }

    public async Task<bool> ValidateApiKeyAsync(string apiKey, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(apiKey)) return false;

        try
        {
            // Lightweight call to fetch models to verify the API key is active
            var testUri = $"https://generativelanguage.googleapis.com/v1beta/models?key={apiKey}";
            var response = await _httpClient.GetAsync(testUri, ct);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
