using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class DeleteTeacherCommandHandler : IRequestHandler<DeleteTeacherCommand, bool>
{
    private readonly IUserRepository _repository;
    public DeleteTeacherCommandHandler(IUserRepository repository) => _repository = repository;

    public async Task<bool> Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}