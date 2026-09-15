using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using StudentRanking.Application.Interfaces;
using StudentRanking.Domain.Repositories;
using StudentRanking.Infrastructure.Persistence;
using StudentRanking.Infrastructure.Queries;
using StudentRanking.Infrastructure.Repositories;
using StudentRanking.Infrastructure.Services;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/student-ranking-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Iniciando a API do Student Ranking...");

    var builder = WebApplication.CreateBuilder(args);

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<StudentRankingDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

    builder.Services.AddScoped<IStudentRepository, StudentRepository>();
    builder.Services.AddScoped<IExcelReader, ClosedXmlExcelReader>();
    builder.Services.AddScoped<IRankingQueryService, RankingQueryService>();
    builder.Services.AddScoped<IClassroomRepository, ClassroomRepository>();
    builder.Services.AddScoped<IRewardRepository, RewardRepository>();
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IRankingHistoryRepository, RankingHistoryRepository>();

    builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(StudentRanking.Application.Commands.AddStarCommand).Assembly));

    builder.Host.UseSerilog();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Producao", policy =>
        {
            policy.WithOrigins("urlProd", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    builder.Services.AddHealthChecks();

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var keyString = builder.Configuration["Jwt:Key"];
    var key = Encoding.ASCII.GetBytes(keyString);

    builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
    
    var app = builder.Build();

    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            Log.Error("Erro global capturado no sistema.");

            await context.Response.WriteAsJsonAsync(new
            {
                Message = "Ops! Ocorreu um erro interno no servidor. Nossa equipe técnica já foi notificada."
            });
        });
    });

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("Producao");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapHealthChecks("/health");
    app.MapControllers();
    app.Run();
}
catch (Exception ex) when (ex.GetType().Name is not "HostAbortedException")
{
    Log.Fatal(ex, "A API falhou catastroficamente ao iniciar.");
}
finally
{
    Log.CloseAndFlush();
}