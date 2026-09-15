# Estágio 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto para restaurar as dependências (otimização de cache do Docker)
COPY ["StudentRanking.Api/StudentRanking.Api.csproj", "StudentRanking.Api/"]
COPY ["StudentRanking.Application/StudentRanking.Application.csproj", "StudentRanking.Application/"]
COPY ["StudentRanking.Domain/StudentRanking.Domain.csproj", "StudentRanking.Domain/"]
COPY ["StudentRanking.Infrastructure/StudentRanking.Infrastructure.csproj", "StudentRanking.Infrastructure/"]
RUN dotnet restore "StudentRanking.Api/StudentRanking.Api.csproj"

# Copia o resto do código e faz o build
COPY . .
WORKDIR "/src/StudentRanking.Api"
RUN dotnet build "StudentRanking.Api.csproj" -c Release -o /app/build

# Estágio 2: Publish
FROM build AS publish
RUN dotnet publish "StudentRanking.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio 3: Runtime (Imagem leve apenas para rodar a aplicação)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# O .NET 8 usa a porta 8080 por padrão no container
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StudentRanking.Api.dll"]
