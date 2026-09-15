using Microsoft.EntityFrameworkCore;
using StudentRanking.Domain.Entities;
using StudentRanking.Infrastructure.Mappings;

namespace StudentRanking.Infrastructure.Persistence
{
    public class StudentRankingDbContext : DbContext
    {
        public StudentRankingDbContext(DbContextOptions<StudentRankingDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Classroom> Classrooms => Set<Classroom>();
        public DbSet<Student> Students => Set<Student>();
        public DbSet<Reward> Rewards => Set<Reward>();
        public DbSet<RankingHistory> RankingHistories => Set<RankingHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(StudentRankingDbContext).Assembly);
            modelBuilder.ApplyConfiguration(new RankingHistoryMapping());

            base.OnModelCreating(modelBuilder);
        }
    }
}
