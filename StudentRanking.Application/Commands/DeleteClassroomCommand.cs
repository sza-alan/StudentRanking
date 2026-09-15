using MediatR;

namespace StudentRanking.Application.Commands;

public record DeleteClassroomCommand(Guid Id) : IRequest<bool>;