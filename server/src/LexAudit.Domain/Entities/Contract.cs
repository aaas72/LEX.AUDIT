using System;
using LexAudit.Domain.Enums;

namespace LexAudit.Domain.Entities;

public class Contract
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty; // Local path or cloud URL
    public int PageCount { get; set; } = 0;
    
    public UserRole UserPartyRole { get; set; } = UserRole.Other; // Mandatory Input
    
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    // One-to-One
    public AuditReport? AuditReport { get; set; }
}
