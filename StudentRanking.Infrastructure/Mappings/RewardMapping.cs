using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentRanking.Domain.Entities;

namespace StudentRanking.Infrastructure.Mappings
{
    public class RewardMapping : IEntityTypeConfiguration<Reward>
    {
        public void Configure(EntityTypeBuilder<Reward> builder)
        {
            builder.ToTable("Rewards");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(r => r.StarCost)
                .IsRequired();

            builder.HasOne(r => r.Classroom)
                .WithMany(c => c.Rewards)
                .HasForeignKey(r => r.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}