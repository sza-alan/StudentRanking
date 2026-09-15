using MediatR;

namespace StudentRanking.Application.Commands;

public record DeleteStudentCommand(Guid Id) : IRequest<bool>;