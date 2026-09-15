using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Repositories
{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly StudentRankingDbContext _context;

        public ClassroomRepository(StudentRankingDbContext context)
        {
            _context = context;
        }

        public async Task<Classroom> GetByNameAndTeacherAsync(string name, Guid teacherId, CancellationToken cancellationToken)
        {
            return await _context.Classrooms
                .FirstOrDefaultAsync(c => c.Name == name && c.TeacherId == teacherId, cancellationToken);
        }

        public async Task AddAsync(Classroom classroom, CancellationToken cancellationToken)
        {
            await _context.Classrooms.AddAsync(classroom, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var classroom = await _context.Classrooms.FindAsync(new object[] { id }, cancellationToken);
            if (classroom != null)
            {
                _context.Classrooms.Remove(classroom);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}