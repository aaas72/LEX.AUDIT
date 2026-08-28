using Microsoft.EntityFrameworkCore;
using LexAudit.Domain.Entities;
using System.Text.Json;

namespace LexAudit.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<AuditReport> AuditReports => Set<AuditReport>();
    public DbSet<AuditFinding> AuditFindings => Set<AuditFinding>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Contract Configuration
        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Contracts)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // AuditReport Configuration
        modelBuilder.Entity<AuditReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Contract)
                  .WithOne(c => c.AuditReport)
                  .HasForeignKey<AuditReport>(e => e.ContractId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // AuditFinding Configuration
        modelBuilder.Entity<AuditFinding>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.AuditReport)
                  .WithMany(r => r.Findings)
                  .HasForeignKey(e => e.AuditReportId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
