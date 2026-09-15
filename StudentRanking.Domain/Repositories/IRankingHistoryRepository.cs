using StudentRanking.Domain.Entities;

namespace StudentRanking.Domain.Repositories;

public interface IRankingHistoryRepository
{
    Task AddRangeAsync(IEnumerable<RankingHistory> histories, CancellationToken cancellationToken);
    Task<IEnumerable<RankingHistory>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken);
    Task DeleteByCycleAsync(Guid classroomId, string cycleName, CancellationToken cancellationToken);
}