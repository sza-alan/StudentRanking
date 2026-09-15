using MediatR;
namespace StudentRanking.Application.Commands;
public record DeleteTeacherCommand(Guid Id) : IRequest<bool>;