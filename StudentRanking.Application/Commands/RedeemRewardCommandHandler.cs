using MediatR;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class RedeemRewardCommandHandler : IRequestHandler<RedeemRewardCommand, bool>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IRewardRepository _rewardRepository;

    public RedeemRewardCommandHandler(IStudentRepository studentRepository, IRewardRepository rewardRepository)
    {
        _studentRepository = studentRepository;
        _rewardRepository = rewardRepository;
    }

    public async Task<bool> Handle(RedeemRewardCommand request, CancellationToken cancellationToken)
    {
        var student = await _studentRepository.GetByIdAsync(request.StudentId, cancellationToken);
        if (student == null) throw new Exception("Aluno não encontrado.");

        var reward = await _rewardRepository.GetByIdAsync(request.RewardId, cancellationToken);
        if (reward == null) throw new Exception("Recompensa não encontrada.");

        if (student.ClassroomId != reward.ClassroomId)
            throw new Exception("Esta recompensa não pertence à turma do aluno.");

        student.SpendStars(reward.StarCost);

        await _studentRepository.UpdateAsync(student, cancellationToken);

        return true;
    }
}