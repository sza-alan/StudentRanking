namespace StudentRanking.Domain.Entities
{
    public class Classroom
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public Guid TeacherId { get; private set; }
        public User Teacher { get; private set; }

        public ICollection<Student> Students { get; private set; } = new List<Student>();

        public ICollection<Reward> Rewards { get; private set; } = new List<Reward>();

        public Classroom(string name, Guid teacherId)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Nome da turma é obrigatório.");

            Id = Guid.NewGuid();
            Name = name;
            TeacherId = teacherId;
        }
    }
}
