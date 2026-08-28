using LexAudit.Domain.Entities;

namespace LexAudit.Application.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(User user);
}
