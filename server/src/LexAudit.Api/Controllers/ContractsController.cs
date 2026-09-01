using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using LexAudit.Application.Audit;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using LexAudit.Application.DTOs;
using LexAudit.Infrastructure.Persistence;

namespace LexAudit.Api.Controllers;

[ApiController]
[Route("api/v1/contracts")]
[Authorize]
public class ContractsController : ControllerBase
{
    private readonly AuditOrchestrator _orchestrator;
    private readonly AppDbContext _dbContext;

    public ContractsController(AuditOrchestrator orchestrator, AppDbContext dbContext)
    {
        _orchestrator = orchestrator;
        _dbContext = dbContext;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(25_000_000)] // 25 MB max
    public async Task<IActionResult> UploadContract(
        IFormFile file, 
        [FromForm] UserRole userRole,
        CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "AUDIT.UPLOAD.ERROR_NO_FILE" });
        }

        if (file.ContentType != "application/pdf")
        {
            return BadRequest(new { error = "AUDIT.UPLOAD.ERROR_PDF_ONLY_API" });
        }

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized("User not identified.");
        }

        var dbUser = await _dbContext.Users.FindAsync(new object[] { userId }, ct);
        if (dbUser == null)
        {
            return Unauthorized("User not found in DB.");
        }

        if (string.IsNullOrWhiteSpace(dbUser.GeminiApiKey))
        {
            return BadRequest(new { error = "Gemini API Key is missing. Please set your API key in Settings before auditing." });
        }

        // Create Contract Entity
        var contract = new Contract
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            User = dbUser,
            FileName = file.FileName,
            UserPartyRole = userRole,
            PageCount = 0 
        };

        // Add to DB immediately so it's tracked
        _dbContext.Contracts.Add(contract);
        await _dbContext.SaveChangesAsync(ct);

        // Get language from header (ar, en, tr)
        var language = Request.Headers.AcceptLanguage.ToString().Split(',')[0] ?? "en";

        // Run Audit Pipeline
        using var stream = file.OpenReadStream();
        var report = await _orchestrator.RunAuditAsync(contract, stream, language, ct);

        if (report.Status == AuditStatus.Failed)
        {
            // Optional: you can update the DB state here if desired
            return BadRequest(new { error = report.ErrorMessage });
        }

        return Ok(new { 
            message = "تم استلام الملف بنجاح وبدأ التدقيق.", 
            contractId = contract.Id,
            auditReportId = report.Id 
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetMyContracts(CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var contracts = await _dbContext.Contracts
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.UploadedAt)
            .Select(c => new ContractSummaryDto
            {
                Id = c.Id,
                FileName = c.FileName,
                UploadedAt = c.UploadedAt,
                Status = "Completed", // TODO: Read from actual Report once linked properly in DB
                RiskLevel = "Unknown",
                OverallRiskScore = 0
            })
            .ToListAsync(ct);

        return Ok(contracts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetContractDetails(Guid id, CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var contract = await _dbContext.Contracts
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, ct);

        if (contract == null)
        {
            return NotFound();
        }

        var dto = new ContractDetailDto
        {
            Id = contract.Id,
            FileName = contract.FileName,
            UploadedAt = contract.UploadedAt,
            UserPartyRole = contract.UserPartyRole,
            Report = null // TODO: Fetch from actual AuditReport table when implemented fully in DB
        };

        return Ok(dto);
    }
}
