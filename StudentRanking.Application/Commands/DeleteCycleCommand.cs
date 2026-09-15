using MediatR;
namespace StudentRanking.Application.Commands;
public record DeleteCycleCommand(Guid ClassroomId, string CycleName) : IRequest<bool>;