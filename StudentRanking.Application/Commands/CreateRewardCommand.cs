using MediatR;

namespace StudentRanking.Application.Commands;

public record CreateRewardCommand(string Name, int StarCost, Guid ClassroomId) : IRequest<Guid>;