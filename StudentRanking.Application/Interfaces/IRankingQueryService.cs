using StudentRanking.Application.Queries;

namespace StudentRanking.Application.Interfaces
{
    public interface IRankingQueryService
    {
        Task<List<StudentRankingDto>> GetTopStudentsAsync(Guid classroomId, CancellationToken cancellationToken);
    }
}
