using MediatR;
namespace StudentRanking.Application.Commands;

public record CloseCycleCommand(Guid ClassroomId, string CycleName) : IRequest<bool>;