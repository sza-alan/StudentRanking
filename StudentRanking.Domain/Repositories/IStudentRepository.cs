using StudentRanking.Domain.Entities;

namespace StudentRanking.Domain.Repositories
{
    public interface IStudentRepository
    {
        Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task AddAsync(Student student, CancellationToken cancellationToken);
        Task UpdateAsync(Student student, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(string firstName, string lastName, Guid classroomId, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task<IEnumerable<Student>> GetByClassroomIdAsync(Guid classroomId, CancellationToken cancellationToken);
        Task UpdateRangeAsync(IEnumerable<Student> students, CancellationToken cancellationToken);
    }
}
