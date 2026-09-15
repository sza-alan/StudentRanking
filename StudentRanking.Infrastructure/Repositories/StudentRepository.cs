using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;

namespace StudentRanking.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly StudentRankingDbContext _context;

        public StudentRepository(StudentRankingDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Students.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task AddAsync(Student student, CancellationToken cancellationToken)
        {
            await _context.Students.AddAsync(student, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Student student, CancellationToken cancellationToken)
        {
            _context.Students.Update(student);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(string firstName, string lastName, Guid classroomId, CancellationToken cancellationToken)
        {
            return await _context.Students.AnyAsync(s =>
                s.FirstName == firstName &&
                s.LastName == lastName &&
                s.ClassroomId == classroomId,
                cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var student = await _context.Students.FindAsync(new object[] { id }, cancellationToken);
            if (student != null)
            {
                _context.Students.Remove(student);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<IEnumerable<Student>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken)
        {
            return await _context.Students
                .Where(s => s.ClassroomId == classroomId)
                .ToListAsync(cancellationToken);
        }

        public async Task UpdateRangeAsync(IEnumerable<Student> students, CancellationToken cancellationToken)
        {
            _context.Students.UpdateRange(students);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
