using System;

namespace StudentRanking.Domain.Entities;

public class Student
{
    public Guid Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public int StarCount { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Guid ClassroomId { get; private set; }
    public Classroom Classroom { get; private set; }

    public Student(string firstName, string lastName, Guid classroomId)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException("O nome do aluno é obrigatório.");

        if (classroomId == Guid.Empty)
            throw new ArgumentException("O ID da turma é obrigatório.");

        Id = Guid.NewGuid();
        FirstName = firstName;
        LastName = lastName;
        ClassroomId = classroomId;
        StarCount = 0;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddStar()
    {
        StarCount++;
    }

    public void RemoveStar()
    {
        if (StarCount > 0)
        {
            StarCount--;
        }
    }

    public void UpdateDetails(string firstName, string lastName, Guid classroomId)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException("O nome do aluno é obrigatório.");

        if (classroomId == Guid.Empty)
            throw new ArgumentException("O ID da turma é obrigatório.");

        FirstName = firstName;
        LastName = lastName;
        ClassroomId = classroomId;
    }

    public void SpendStars(int amount)
    {
        if (amount <= 0)
            throw new ArgumentException("O valor a descontar deve ser maior que zero.");

        if (StarCount < amount)
            throw new InvalidOperationException("Saldo de estrelas insuficiente para esta recompensa.");

        StarCount -= amount;
    }

    public void ResetStars()
    {
        StarCount = 0;
    }
}