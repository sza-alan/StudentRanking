using MediatR;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class CloseCycleCommandHandler : IRequestHandler<CloseCycleCommand, bool>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IRankingHistoryRepository _historyRepository;

    public CloseCycleCommandHandler(IStudentRepository studentRepository, IRankingHistoryRepository historyRepository)
    {
        _studentRepository = studentRepository;
        _historyRepository = historyRepository;
    }

    public async Task<bool> Handle(CloseCycleCommand request, CancellationToken cancellationToken)
    {
        var students = await _studentRepository.GetByClassroomIdAsync(request.ClassroomId, cancellationToken);

        if (!students.Any()) return false;

        var histories = new List<RankingHistory>();

        foreach (var student in students)
        {
            histories.Add(new RankingHistory(student.Id, request.ClassroomId, request.CycleName, student.StarCount));

            student.ResetStars();
        }

        await _historyRepository.AddRangeAsync(histories, cancellationToken);

        await _studentRepository.UpdateRangeAsync(students, cancellationToken);

        return true;
    }
}