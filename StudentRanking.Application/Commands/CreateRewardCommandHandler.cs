using MediatR;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands
{
    public class CreateRewardCommandHandler : IRequestHandler<CreateRewardCommand, Guid>
    {
        private readonly IRewardRepository _repository;

        public CreateRewardCommandHandler(IRewardRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateRewardCommand request, CancellationToken cancellationToken)
        {
            var reward = new Reward(request.Name, request.StarCost, request.ClassroomId);

            await _repository.AddAsync(reward, cancellationToken);

            return reward.Id;
        }
    }
}
