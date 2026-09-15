using MediatR;

namespace StudentRanking.Application.Commands;

public record RedeemRewardCommand(Guid StudentId, Guid RewardId) : IRequest<bool>;