using StudentRanking.Domain.Entities;

namespace StudentRanking.Application.Interfaces
{
    public record MasterStudentExcelDto(string Nome, string Sobrenome, string Sala);

    public interface IExcelReader
    {
        IEnumerable<Student> ReadStudentsFromExcel(Stream excelStream, Guid classroomId);
        IEnumerable<MasterStudentExcelDto> ReadMasterExcel(Stream fileStream);
    }
}
