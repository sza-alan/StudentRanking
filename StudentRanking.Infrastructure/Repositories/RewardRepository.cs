using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Repositories
{
    public class RewardRepository : IRewardRepository
    {
        private readonly StudentRankingDbContext _context;

        public RewardRepository(StudentRankingDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Reward reward, CancellationToken cancellationToken)
        {
            await _context.Rewards.AddAsync(reward, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task<IEnumerable<Reward>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken)
        {
            return await _context.Rewards
                .Where(r => r.ClassroomId == classroomId)
                .ToListAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var reward = await _context.Rewards.FindAsync(new object[] {id}, cancellationToken);
            if (reward != null)
            {
                _context.Rewards.Remove(reward);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<Reward?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Rewards.FindAsync(new object[] { id }, cancellationToken);
        }
    }
}
