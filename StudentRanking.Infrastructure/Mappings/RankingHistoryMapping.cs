using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentRanking.Domain.Entities;

namespace StudentRanking.Infrastructure.Mappings;

public class RankingHistoryMapping : IEntityTypeConfiguration<RankingHistory>
{
    public void Configure(EntityTypeBuilder<RankingHistory> builder)
    {
        builder.ToTable("RankingHistories");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.CycleName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(h => h.StarsEarned)
               .IsRequired();

        builder.Property(h => h.ClosedAt)
               .IsRequired();

        builder.HasOne(h => h.Student)
               .WithMany()
               .HasForeignKey(h => h.StudentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(h => h.Classroom)
               .WithMany()
               .HasForeignKey(h => h.ClassroomId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}