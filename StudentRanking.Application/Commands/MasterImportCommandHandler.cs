using MediatR;
using StudentRanking.Application.Interfaces;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands
{
    public class MasterImportCommandHandler : IRequestHandler<MasterImportCommand, int>
    {
        private readonly IExcelReader _excelReader;
        private readonly IStudentRepository _studentRepository;
        private readonly IClassroomRepository _classroomRepository;

        public MasterImportCommandHandler(
            IExcelReader excelReader,
            IStudentRepository studentRepository,
            IClassroomRepository classroomRepository)
        {
            _excelReader = excelReader;
            _studentRepository = studentRepository;
            _classroomRepository = classroomRepository;
        }

        public async Task<int> Handle(MasterImportCommand request, CancellationToken cancellationToken)
        {
            var rawStudents = _excelReader.ReadMasterExcel(request.FileStream);

            int count = 0;
            var classroomCache = new Dictionary<string, Guid>();

            foreach (var row in rawStudents)
            {
                if (!classroomCache.TryGetValue(row.Sala, out Guid classroomId))
                {
                    var classroom = await _classroomRepository.GetByNameAndTeacherAsync(row.Sala, request.TeacherId, cancellationToken);

                    if (classroom == null)
                    {
                        classroom = new Classroom(row.Sala, request.TeacherId);
                        await _classroomRepository.AddAsync(classroom, cancellationToken);
                    }

                    classroomId = classroom.Id;
                    classroomCache[row.Sala] = classroomId;
                }

                bool exists = await _studentRepository.ExistsAsync(row.Nome, row.Sobrenome, classroomId, cancellationToken);

                if (!exists)
                {
                    var newStudent = new Student(row.Nome, row.Sobrenome, classroomId);

                    await _studentRepository.AddAsync(newStudent, cancellationToken);
                    count++;
                }
            }

            return count;
        }
    }
}