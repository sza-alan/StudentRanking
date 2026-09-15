using Microsoft.EntityFrameworkCore;
using StudentRanking.Application.Interfaces;
using StudentRanking.Application.Queries;
using StudentRanking.Domain.Entities;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Queries
{
    public class RankingQueryService : IRankingQueryService
    {
        private readonly StudentRankingDbContext _context;

        public RankingQueryService(StudentRankingDbContext context)
        {
            _context = context;
        }

        public async Task<List<StudentRankingDto>> GetTopStudentsAsync(Guid classroomId, CancellationToken cancellationToken)
        {
            var students = await _context.Students
                .AsNoTracking()
                .Where(s => s.ClassroomId == classroomId)
                .OrderByDescending(s => s.StarCount)
                .ThenBy(s => s.FirstName)
                .Select(s => new { s.Id, s.FirstName, s.LastName, s.StarCount })
                .ToListAsync(cancellationToken);

            var ranking = new List<StudentRankingDto>();
            for (int i = 0; i < students.Count; i++)
            {
                var student = students[i];
                ranking.Add(new StudentRankingDto(
                    student.Id,
                    $"{student.FirstName} {student.LastName}",
                    student.StarCount,
                    i + 1
                ));
            }

            return ranking;
        }
    }
}
