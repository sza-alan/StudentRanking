using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class DeleteClassroomCommandHandler : IRequestHandler<DeleteClassroomCommand, bool>
{
    private readonly IClassroomRepository _repository;

    public DeleteClassroomCommandHandler(IClassroomRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteClassroomCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}