using MediatR;
using StudentRanking.Domain.Entities;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Application.Commands;

public class RegisterTeacherCommandHandler : IRequestHandler<RegisterTeacherCommand, Guid>
{
    private readonly IUserRepository _userRepository;

    public RegisterTeacherCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Guid> Handle(RegisterTeacherCommand request, CancellationToken cancellationToken)
    {
        var exists = await _userRepository.ExistsByEmailAsync(request.Email.ToLower().Trim(), cancellationToken);
        if (exists) throw new InvalidOperationException("Este e-mail já está em uso.");

        var teacher = new User(
            request.Name, 
            request.Email,
            BCrypt.Net.BCrypt.HashPassword(request.Password), 
            UserRole.Teacher);

        await _userRepository.AddAsync(teacher, cancellationToken);

        return teacher.Id;
    }
}