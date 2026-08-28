using System;
using System.Collections.Generic;
using LexAudit.Domain.Enums;

namespace LexAudit.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    
    // Password Reset
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetExpiry { get; set; }
    
    // SaaS Quota Management
    public SubscriptionPlan CurrentPlan { get; set; } = SubscriptionPlan.Free;
    public int AuditsUsedThisMonth { get; set; } = 0;
    public DateTime SubscriptionExpiry { get; set; } = DateTime.UtcNow.AddYears(100); // Default forever for free
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Property
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
