using MediatR;
using StudentRanking.Application.Interfaces;

namespace StudentRanking.Application.Queries;

public class GetRankingQueryHandler : IRequestHandler<GetRankingQuery, List<StudentRankingDto>>
{
    private readonly IRankingQueryService _queryService;

    public GetRankingQueryHandler(IRankingQueryService queryService)
    {
        _queryService = queryService;
    }

    public async Task<List<StudentRankingDto>> Handle(GetRankingQuery request, CancellationToken cancellationToken)
    {
        return await _queryService.GetTopStudentsAsync(request.ClassroomId, cancellationToken);
    }
}