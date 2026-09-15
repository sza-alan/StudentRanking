using ClosedXML.Excel;
using StudentRanking.Application.Interfaces;
using StudentRanking.Domain.Entities;

namespace StudentRanking.Infrastructure.Services;

public class ClosedXmlExcelReader : IExcelReader
{
    public IEnumerable<Student> ReadStudentsFromExcel(Stream excelStream, Guid classroomId)
    {
        var students = new List<Student>();
        using var workbook = new XLWorkbook(excelStream);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed().RowsUsed();

        bool isFirstRow = true;

        foreach (var row in rows)
        {
            if (isFirstRow) { isFirstRow = false; continue; }

            try
            {
                var firstName = row.Cell(1).GetString().Trim();
                var lastName = row.Cell(2).GetString().Trim();

                if (string.IsNullOrEmpty(firstName)) continue;

                var student = new Student(firstName, lastName, classroomId);
                students.Add(student);
            }
            catch (Exception) { continue; }
        }

        return students;
    }

    public IEnumerable<MasterStudentExcelDto> ReadMasterExcel(Stream fileStream)
    {
        var students = new List<MasterStudentExcelDto>();
        using var workbook = new XLWorkbook(fileStream);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed().RowsUsed().Skip(1);

        foreach (var row in rows)
        {
            var nome = row.Cell(1).GetValue<string>();
            var sobrenome = row.Cell(2).GetValue<string>();
            var sala = row.Cell(3).GetValue<string>();
            
            if (!string.IsNullOrWhiteSpace(nome) && !string.IsNullOrWhiteSpace(sala))
            {
                students.Add(new MasterStudentExcelDto(nome, sobrenome, sala));
            }
        }

        return students;
    }
}