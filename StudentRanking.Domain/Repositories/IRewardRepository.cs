using StudentRanking.Domain.Entities;

namespace StudentRanking.Domain.Repositories
{
    public interface IRewardRepository
    {
        Task AddAsync(Reward reward, CancellationToken cancellationToken);
        Task<IEnumerable<Reward>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task<Reward?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    }
}
