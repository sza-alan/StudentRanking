using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands
{
    public class AddStarCommandHandler : IRequestHandler<AddStarCommand, bool>
    {
        private readonly IStudentRepository _repository;

        public AddStarCommandHandler(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(AddStarCommand request, CancellationToken cancellationToken)
        {
            var student = await _repository.GetByIdAsync(request.StudentId, cancellationToken);

            if (student == null)
            {
                return false;
            }

            student.AddStar();

            await _repository.UpdateAsync(student, cancellationToken);

            return true;
        }
    }
}
