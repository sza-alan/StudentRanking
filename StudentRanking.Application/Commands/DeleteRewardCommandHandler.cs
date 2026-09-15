using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class DeleteRewardCommandHandler : IRequestHandler<DeleteRewardCommand, bool>
{
    private readonly IRewardRepository _repository;

    public DeleteRewardCommandHandler(IRewardRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteRewardCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}