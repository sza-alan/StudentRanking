using StudentRanking.Domain.Entities;

namespace StudentRanking.Domain.Repositories
{
    public interface IClassroomRepository
    {
        Task<Classroom> GetByNameAndTeacherAsync(string name, Guid teacherId, CancellationToken cancellationToken);
        Task AddAsync(Classroom classroom, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}