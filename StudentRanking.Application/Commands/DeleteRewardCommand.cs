using MediatR;

namespace StudentRanking.Application.Commands;

public record DeleteRewardCommand(Guid Id) : IRequest<bool>;