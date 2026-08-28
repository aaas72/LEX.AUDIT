using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using LexAudit.Infrastructure.Persistence;

namespace LexAudit.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
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
            CurrentPlan = dbUser.CurrentPlan.ToString(),
            AuditsUsedThisMonth = dbUser.AuditsUsedThisMonth,
            TotalAuditsAllowed = dbUser.CurrentPlan == SubscriptionPlan.Free ? 3 : 100, // Just a rough mockup
            SubscriptionExpiry = dbUser.SubscriptionExpiry
        });
    }

    [HttpPost("subscription/upgrade")]
    public IActionResult UpgradeSubscription([FromBody] UpgradeRequest request)
    {
        // Mocking payment integration
        return Ok(new { Message = $"Successfully upgraded to {request.Plan}" });
    }
}

public class UpgradeRequest
{
    public SubscriptionPlan Plan { get; set; }
}
