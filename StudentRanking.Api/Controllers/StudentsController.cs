using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentRanking.Application.Commands;
using StudentRanking.Application.Queries;
using System.Security.Claims;

namespace StudentRanking.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StudentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{id}/star")]
        public async Task<IActionResult> AddStar(Guid id)
        {
            var success = await _mediator.Send(new AddStarCommand(id));

            if (!success) return NotFound(new { Message = "Aluno não encontrado." });

            return Ok(new { Message = "Estrela adicionada com sucesso!" });
        }

        [HttpPost("{id}/remove-star")]
        public async Task<IActionResult> RemoveStar(Guid id)
        {
            var command = new RemoveStarCommand(id);
            var result = await _mediator.Send(command);

            if (!result) return NotFound("Aluno não encontrado.");

            return Ok(new { Message = "Estrela removida com sucesso!" });
        }

        [HttpPost("{classroomId}/import")]
        public async Task<IActionResult> ImportExcel([FromRoute] Guid classroomId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            using var stream = file.OpenReadStream();

            var command = new ImportStudentsCommand(stream, classroomId);

            var count = await _mediator.Send(command);
            return Ok(new { Message = $"{count} alunos importados com sucesso!" });
        }

        [HttpPost("master-import")]
        public async Task<IActionResult> MasterImport(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            var teacherIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(teacherIdString, out Guid teacherId))
                return Unauthorized();

            using var stream = file.OpenReadStream();

            var command = new MasterImportCommand(stream, teacherId);
            var count = await _mediator.Send(command);

            return Ok(new { Message = $"Setup concluído! {count} alunos organizados com sucesso." });
        }

        [HttpGet("{classroomId}/ranking")]
        public async Task<IActionResult> GetRanking([FromRoute] Guid classroomId)
        {
            var query = new GetRankingQuery(classroomId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _mediator.Send(new DeleteStudentCommand(id));
            return success ? NoContent() : NotFound();
        }

        [HttpPost("{studentId}/redeem/{rewardId}")]
        public async Task<IActionResult> RedeemReward(Guid studentId, Guid rewardId)
        {
            try
            {
                var success = await _mediator.Send(new RedeemRewardCommand(studentId, rewardId));
                return Ok(new { Message = "Recompensa resgatada com sucesso! Estrelas debitadas." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao processar a compra: " + ex.Message });
            }
        }
    }
}
