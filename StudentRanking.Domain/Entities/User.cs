namespace StudentRanking.Domain.Entities
{
    public enum UserRole { Admin, Teacher }
    public class User
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public UserRole Role { get; private set; }

        public ICollection<Classroom> Classrooms { get; private set; } = new List<Classroom>();

        public User(string name, string email, string passwordHash, UserRole role)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email é obrigatório.");

            Id = Guid.NewGuid();
            Name = name;
            Email = email.ToLower().Trim();
            PasswordHash = passwordHash;
            Role = role;
        }
    }
}
