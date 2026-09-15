namespace StudentRanking.Domain.Entities
{
    public class RankingHistory
    {
        public Guid Id { get; private set; }
        public Guid StudentId { get; private set; }
        public Guid ClassroomId { get; private set; }

        public string CycleName { get; private set; }
        public int StarsEarned { get; private set; }
        public DateTime ClosedAt { get; private set; }

        public Student Student { get; private set; }
        public Classroom Classroom { get; private set; }

        protected RankingHistory() { }

        public RankingHistory(Guid studentId, Guid classroomId, string cycleName, int starsEarned)
        {
            if (string.IsNullOrWhiteSpace(cycleName))
                throw new ArgumentException("O nome do ciclo é obrigatório.");

            Id = Guid.NewGuid();
            StudentId = studentId;
            ClassroomId = classroomId;
            CycleName = cycleName;
            StarsEarned = starsEarned;
            ClosedAt = DateTime.UtcNow;
        }
    }
}