using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentRanking.Application.Commands;
using StudentRanking.Domain.Repositories;

namespace StudentRanking.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RewardsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IRewardRepository _repository;

        public RewardsController(IMediator mediator, IRewardRepository repository)
        {
            _mediator = mediator;
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRewardCommand command)
        {
            var rewardId = await _mediator.Send(command);
            return Ok(new { Id = rewardId, Message = "Prêmio cadastrado na lojinha!" });
        }

        [HttpGet("classroom/{classroomId}")]
        public async Task<IActionResult> GetByClassroom(Guid classroomId, CancellationToken cancellationToken)
        {
            var rewards = await _repository.GetByClassroomIdAsync(classroomId, cancellationToken);

            var response = rewards.Select(r => new
            {
                r.Id,
                r.Name,
                r.StarCost
            });

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _mediator.Send(new DeleteRewardCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
