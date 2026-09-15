using MediatR;
namespace StudentRanking.Application.Commands;

public record RegisterTeacherCommand(string Name, string Email, string Password) : IRequest<Guid>;