using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using LexAudit.Application.Audit.Pipeline;
using NUnit.Framework;

namespace LexAudit.Tests.Pipeline;

[TestFixture]
public class Stage4RiskTaxonomyAuditorTests
{
    private Stage4_RiskTaxonomyAuditor _auditor;

    [SetUp]
    public void Setup()
    {
        _auditor = new Stage4_RiskTaxonomyAuditor();
    }

    [Test]
    public async Task AuditRisksAsync_LiabilityCap_ForClient_ReturnsHighRisk()
    {
        // Arrange
        var findings = new List<AuditFinding>
        {
            new AuditFinding
            {
                Id = Guid.NewGuid(),
                Category = ClauseCategory.LiabilityCap,
                VerbatimQuote = "Provider liability is capped at $10."
            }
        };

        // Act
        await _auditor.AuditRisksAsync(findings, UserRole.Client, CancellationToken.None);

        // Assert
        Assert.That(findings[0].RiskLevel, Is.EqualTo(RiskLevel.High));
        Assert.That(findings[0].ImpactScore, Is.EqualTo(8));
    }

    [Test]
    public async Task AuditRisksAsync_LiabilityCap_ForServiceProvider_ReturnsLowRisk()
    {
        // Arrange
        var findings = new List<AuditFinding>
        {
            new AuditFinding
            {
                Id = Guid.NewGuid(),
                Category = ClauseCategory.LiabilityCap,
                VerbatimQuote = "Provider liability is capped at $10."
            }
        };

        // Act
        await _auditor.AuditRisksAsync(findings, UserRole.ServiceProvider, CancellationToken.None);

        // Assert
        Assert.That(findings[0].RiskLevel, Is.EqualTo(RiskLevel.Low));
        Assert.That(findings[0].ImpactScore, Is.EqualTo(2));
    }
}
