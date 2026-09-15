using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public record RemoveStarCommand(Guid StudentId) : IRequest<bool>;

public class RemoveStarCommandHandler : IRequestHandler<RemoveStarCommand, bool>
{
    private readonly IStudentRepository _repository;

    public RemoveStarCommandHandler(IStudentRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(RemoveStarCommand request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetByIdAsync(request.StudentId, cancellationToken);
        if (student == null) return false;

        student.RemoveStar();

        await _repository.UpdateAsync(student, cancellationToken);
        return true;
    }
}