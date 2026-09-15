using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class DeleteCycleCommandHandler : IRequestHandler<DeleteCycleCommand, bool>
{
    private readonly IRankingHistoryRepository _repository;
    public DeleteCycleCommandHandler(IRankingHistoryRepository repository) => _repository = repository;

    public async Task<bool> Handle(DeleteCycleCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteByCycleAsync(request.ClassroomId, request.CycleName, cancellationToken);
        return true;
    }
}