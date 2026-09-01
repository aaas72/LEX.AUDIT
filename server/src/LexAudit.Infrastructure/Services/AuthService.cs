using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LexAudit.Application.Interfaces;
using LexAudit.Application.DTOs;
using LexAudit.Domain.Entities;
using LexAudit.Infrastructure.Persistence;

namespace LexAudit.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public AuthService(AppDbContext dbContext, ITokenService tokenService, IEmailService emailService)
    {
        _dbContext = dbContext;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();
        var exists = await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == emailLower);
        if (exists)
        {
            throw new Exception("AUTH.ERRORS.EMAIL_ALREADY_REGISTERED");
        }

        var user = new User
        {
            Email = emailLower,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        var token = _tokenService.GenerateJwtToken(user);
        
        return new AuthResponse
        {
            Token = token,
            User = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                HasApiKey = !string.IsNullOrWhiteSpace(user.GeminiApiKey)
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailLower);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("AUTH.ERRORS.INVALID_CREDENTIALS");
        }

        var token = _tokenService.GenerateJwtToken(user);
        
        return new AuthResponse
        {
            Token = token,
            User = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                HasApiKey = !string.IsNullOrWhiteSpace(user.GeminiApiKey)
            }
        };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailLower);
        
        if (user == null)
        {
            // Do not reveal if the email exists or not
            return;
        }

        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
        await _dbContext.SaveChangesAsync();

        var resetLink = $"http://localhost:4200/auth/reset-password?token={user.PasswordResetToken}&email={Uri.EscapeDataString(user.Email)}";
        var body = $"Please reset your password using this link: {resetLink}";
        
        await _emailService.SendEmailAsync(user.Email, "LexAudit Password Reset", body);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => 
            u.Email.ToLower() == emailLower && 
            u.PasswordResetToken == request.Token);

        if (user == null || !user.PasswordResetExpiry.HasValue || user.PasswordResetExpiry.Value < DateTime.UtcNow)
        {
            throw new Exception("AUTH.ERRORS.INVALID_OR_EXPIRED_TOKEN");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetExpiry = null;
        
        await _dbContext.SaveChangesAsync();
    }
}
