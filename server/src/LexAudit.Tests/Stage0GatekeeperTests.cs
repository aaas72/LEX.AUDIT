using System;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Domain.Enums;
using LexAudit.Application.Audit.Pipeline;
using NUnit.Framework;

namespace LexAudit.Tests.Pipeline;

[TestFixture]
public class Stage0GatekeeperTests
{
    private Stage0_GatekeeperValidator _gatekeeper;

    [SetUp]
    public void Setup()
    {
        _gatekeeper = new Stage0_GatekeeperValidator();
    }

    [Test]
    public async Task ValidateAsync_WhenPageCountExceedsPlanLimit_ReturnsFalse()
    {
        // Arrange
        var user = new User { CurrentPlan = SubscriptionPlan.Free };
        var contract = new Contract
        {
            Id = Guid.NewGuid(),
            User = user,
            PageCount = 5 // Free allows 3
        };

        // Act
        var (isValid, errorMessage) = await _gatekeeper.ValidateAsync(contract, CancellationToken.None);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(errorMessage, Does.Contain("الاشتراك الحالية لا تسمح"));
    }

    [Test]
    public async Task ValidateAsync_WhenPageCountWithinPlanLimit_ReturnsTrue()
    {
        // Arrange
        var user = new User { CurrentPlan = SubscriptionPlan.Pro };
        var contract = new Contract
        {
            Id = Guid.NewGuid(),
            User = user,
            PageCount = 10 // Pro allows 15
        };

        // Act
        var (isValid, errorMessage) = await _gatekeeper.ValidateAsync(contract, CancellationToken.None);

        // Assert
        Assert.That(isValid, Is.True);
        Assert.That(errorMessage, Is.Empty);
    }
}
