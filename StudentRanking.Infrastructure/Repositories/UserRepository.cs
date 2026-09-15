using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly StudentRankingDbContext _context;

    public UserRepository(StudentRankingDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<User>> GetTeachersAsync(CancellationToken cancellationToken)
    {
        return await _context.Users
            .Where(u => u.Role == UserRole.Teacher)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}