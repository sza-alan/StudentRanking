using DocumentFormat.OpenXml.Math;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudentRanking.Application.Commands;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentRanking.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly StudentRankingDbContext _context;
        private readonly IMediator _mediator;

        public AuthController(StudentRankingDbContext context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public record LoginRequest(string Email, string Password);

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Role.ToString() != "Admin" && !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { Message = "E-mail ou senha incorretos." });
            }

            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes("SuperChaveSecretaDoMeuSaaS_ComMaisDe32CaracteresParaSerSegura");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Token = tokenString,
                User = new { user.Id, user.Name, user.Email, Role = user.Role.ToString() }
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register-teacher")]
        public async Task<IActionResult> RegisterTeacher([FromBody] RegisterTeacherCommand command)
        {
            try
            {
                var teacherId = await _mediator.Send(command);
                return Ok(new { Message = "Professor cadastrado com sucesso!", TeacherId = teacherId });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro interno ao cadastrar professor: " + ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("teachers")]
        public async Task<IActionResult> GetTeachers([FromServices] IUserRepository userRepository, CancellationToken cancellationToken)
        {
            var teachers = await userRepository.GetTeachersAsync(cancellationToken);
            var response = teachers.Select(t => new { t.Id, t.Name, t.Email });
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("teacher/{id}")]
        public async Task<IActionResult> DeleteTeacher(Guid id, [FromServices] IMediator mediator)
        {
            var success = await mediator.Send(new DeleteTeacherCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
