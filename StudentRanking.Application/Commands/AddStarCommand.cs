using MediatR;

namespace StudentRanking.Application.Commands
{
    public record AddStarCommand(Guid StudentId) : IRequest<bool>;
}
