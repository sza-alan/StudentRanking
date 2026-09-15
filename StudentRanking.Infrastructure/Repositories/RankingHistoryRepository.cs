using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Repositories;

public class RankingHistoryRepository : IRankingHistoryRepository
{
    private readonly StudentRankingDbContext _context;

    public RankingHistoryRepository(StudentRankingDbContext context)
    {
        _context = context;
    }

    public async Task AddRangeAsync(IEnumerable<RankingHistory> histories, CancellationToken cancellationToken)
    {
        await _context.RankingHistories.AddRangeAsync(histories, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<RankingHistory>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken)
    {
        return await _context.RankingHistories
            .Include(h => h.Student)
            .Where(h => h.ClassroomId == classroomId)
            .OrderByDescending(h => h.ClosedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteByCycleAsync(Guid classroomId, string cycleName, CancellationToken cancellationToken)
    {
        var records = await _context.RankingHistories
            .Where(h => h.ClassroomId == classroomId && h.CycleName == cycleName)
            .ToListAsync(cancellationToken);

        if (records.Any())
        {
            _context.RankingHistories.RemoveRange(records);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}