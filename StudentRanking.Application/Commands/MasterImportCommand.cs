using MediatR;

namespace StudentRanking.Application.Commands
{
    public class MasterImportCommand : IRequest<int>
    {
        public Stream FileStream { get; set; }
        public Guid TeacherId { get; set; }

        public MasterImportCommand(Stream fileStream, Guid teacherId)
        {
            FileStream = fileStream;
            TeacherId = teacherId;
        }
    }
}