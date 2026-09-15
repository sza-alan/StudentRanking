using MediatR;
using StudentRanking.Application.Interfaces;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands
{
    public record ImportStudentsCommand(Stream FileStream, Guid ClassroomId) : IRequest<int>;

    public class ImportStudentsCommandHandler : IRequestHandler<ImportStudentsCommand, int>
    {
        private readonly IExcelReader _excelReader;
        private readonly IStudentRepository _repository;

        public ImportStudentsCommandHandler(IExcelReader excelReader, IStudentRepository repository)
        {
            _excelReader = excelReader;
            _repository = repository;
        }

        public async Task<int> Handle(ImportStudentsCommand request, CancellationToken cancellationToken)
        {
            var studentsToImport = _excelReader.ReadStudentsFromExcel(request.FileStream, request.ClassroomId);

            int count = 0;

            foreach (var student in studentsToImport)
            {
                await _repository.AddAsync(student, cancellationToken);
                count++;
            }

            return count;
        }
    }
}
