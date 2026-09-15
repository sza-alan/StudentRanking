using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRanking.Application.Commands;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;
using System.Security.Claims;

namespace StudentRanking.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClassroomsController : ControllerBase
{
    private readonly StudentRankingDbContext _context;
    private readonly IMediator _mediator;
    public record CloseCycleRequest(string CycleName);

    public ClassroomsController(StudentRankingDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyClassrooms()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized("Usuário inválido.");

        var classrooms = await _context.Classrooms
            .Where(c => c.TeacherId == userId)
            .Select(c => new { c.Id, c.Name })
            .ToListAsync();

        return Ok(classrooms);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _mediator.Send(new DeleteClassroomCommand(id));
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{classroomId}/close-cycle")]
    public async Task<IActionResult> CloseCycle(Guid classroomId, [FromBody] CloseCycleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CycleName))
            return BadRequest(new { Message = "O nome do ciclo (ex: 1º Bimestre) é obrigatório." });

        var success = await _mediator.Send(new CloseCycleCommand(classroomId, request.CycleName));

        if (success)
            return Ok(new { Message = "Ciclo encerrado! O histórico foi guardado e o ranking reiniciado." });

        return BadRequest(new { Message = "Não foi possível encerrar o ciclo. Verifique se a turma tem alunos." });
    }

    [HttpGet("{classroomId}/history")]
    public async Task<IActionResult> GetHistory(Guid classroomId, [FromServices] IRankingHistoryRepository historyRepo, CancellationToken cancellationToken)
    {
        var history = await historyRepo.GetByClassroomIdAsync(classroomId, cancellationToken);

        var groupedHistory = history
            .GroupBy(h => h.CycleName)
            .Select(g => new
            {
                CycleName = g.Key,
                ClosedAt = g.First().ClosedAt,
                Students = g.OrderByDescending(s => s.StarsEarned).Select(s => new
                {
                    s.StudentId,
                    StudentName = s.Student.FirstName + " " + s.Student.LastName,
                    s.StarsEarned
                })
            })
            .OrderByDescending(g => g.ClosedAt)
            .ToList();

        return Ok(groupedHistory);
    }

    [HttpDelete("{classroomId}/history/{cycleName}")]
    public async Task<IActionResult> DeleteHistory(Guid classroomId, string cycleName)
    {
        var decodedCycleName = Uri.UnescapeDataString(cycleName);
        var success = await _mediator.Send(new DeleteCycleCommand(classroomId, decodedCycleName));
        return success ? NoContent() : NotFound();
    }
}