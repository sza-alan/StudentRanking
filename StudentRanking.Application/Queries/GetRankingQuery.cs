using MediatR;

namespace StudentRanking.Application.Queries;

public record StudentRankingDto(Guid Id, string FullName, int Stars, int Position);

public record GetRankingQuery(Guid ClassroomId) : IRequest<List<StudentRankingDto>>;