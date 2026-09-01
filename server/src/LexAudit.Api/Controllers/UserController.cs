using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Infrastructure.Persistence;
using LexAudit.Application.Interfaces;

namespace LexAudit.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IGeminiProvider _geminiProvider;

    public UserController(AppDbContext dbContext, IGeminiProvider geminiProvider)
    {
        _dbContext = dbContext;
        _geminiProvider = geminiProvider;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dbUser = await _dbContext.Users.FindAsync(userId);
        if (dbUser == null)
        {
            return NotFound("User not found.");
        }

        return Ok(new
        {
            Id = dbUser.Id,
            Email = dbUser.Email,
            FullName = dbUser.FullName,
            HasApiKey = !string.IsNullOrWhiteSpace(dbUser.GeminiApiKey)
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dbUser = await _dbContext.Users.FindAsync(userId);
        if (dbUser == null)
        {
            return NotFound("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            dbUser.FullName = request.FullName;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            Id = dbUser.Id,
            Email = dbUser.Email,
            FullName = dbUser.FullName,
            HasApiKey = !string.IsNullOrWhiteSpace(dbUser.GeminiApiKey)
        });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dbUser = await _dbContext.Users.FindAsync(userId);
        if (dbUser == null)
        {
            return NotFound("User not found.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, dbUser.PasswordHash))
        {
            return BadRequest(new { error = "Invalid current password." });
        }

        dbUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully." });
    }

    [HttpPut("me/api-key")]
    public async Task<IActionResult> UpdateApiKey([FromBody] UpdateApiKeyRequest request, CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dbUser = await _dbContext.Users.FindAsync(new object[] { userId }, ct);
        if (dbUser == null)
        {
            return NotFound("User not found.");
        }

        var isValid = await _geminiProvider.ValidateApiKeyAsync(request.ApiKey, ct);
        if (!isValid)
        {
            return BadRequest(new { error = "Invalid or inactive Gemini API Key." });
        }

        dbUser.GeminiApiKey = request.ApiKey;
        await _dbContext.SaveChangesAsync(ct);

        return Ok(new { message = "API Key saved and validated successfully." });
    }

    [HttpGet("me/api-key/verify")]
    public async Task<IActionResult> VerifyApiKey(CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dbUser = await _dbContext.Users.FindAsync(new object[] { userId }, ct);
        if (dbUser == null || string.IsNullOrWhiteSpace(dbUser.GeminiApiKey))
        {
            return Ok(new { isValid = false });
        }

        var isValid = await _geminiProvider.ValidateApiKeyAsync(dbUser.GeminiApiKey, ct);
        return Ok(new { isValid });
    }

}

public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class UpdateApiKeyRequest
{
    public string ApiKey { get; set; } = string.Empty;
}
