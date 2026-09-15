namespace StudentRanking.Domain.Entities
{
    public class Reward
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public int StarCost { get; private set; }
        public Guid ClassroomId { get; private set; }

        public Classroom Classroom { get; private set; }

        protected Reward() { }

        public Reward(string name, int starCost, Guid classroomId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("O nome do prémio é obrigatório.");

            if (starCost <= 0)
                throw new ArgumentException("O custo em estrelas deve ser maior que zero.");

            if (classroomId == Guid.Empty)
                throw new ArgumentException("O ID da turma é obrigatório.");

            Id = Guid.NewGuid();
            Name = name;
            StarCost = starCost;
            ClassroomId = classroomId;
        }

        public void UpdateDetails(string name, int starCost)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("O nome do prémio é obrigatório.");

            if (starCost <= 0)
                throw new ArgumentException("O custo em estrelas deve ser maior que zero.");

            Name = name;
            StarCost = starCost;
        }
    }
}
