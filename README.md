# Stellify

> Transformando salas de aula em jornadas de engajamento.

O **Stellify** é um SaaS B2B desenvolvido para escolas e professores que desejam aplicar gamificação no ambiente escolar. Através de um sistema de recompensas (estrelas), loja virtual de prêmios e relatórios de desempenho, a plataforma incentiva o engajamento dos alunos e facilita a comunicação de resultados com os pais.

---

## Funcionalidades Principais

* **Gestão de Professores (Admin):** Painel exclusivo para cadastro e controle de acesso do corpo docente via JWT.
* **Importação em Massa:** Cadastro rápido de turmas e alunos via upload de planilhas `.xlsx`.
* **Ranking em Tempo Real:** Painel de controle para atribuição e remoção ágil de estrelas por aluno.
* **Lojinha de Recompensas:** Criação de prêmios customizados (ex: "5 minutos extras no recreio", "Escolher a música da aula") que os alunos podem "comprar" com suas estrelas.
* **Fechamento de Ciclos:** Função de snapshot para encerrar bimestres/trimestres, salvando o histórico e zerando o placar para a próxima etapa.
* **Relatórios Inteligentes:** Geração automatizada de histórico de desempenho, com layout otimizado para impressão em PDF.

---

## Tecnologias Utilizadas

A aplicação foi construída visando escalabilidade e manutenibilidade, dividida em duas frentes:

### Backend (API REST)
* **C# / .NET 8**
* **Clean Architecture** (Domain, Application, Infrastructure, API)
* **CQRS** (Implementado via biblioteca `MediatR`)
* **Entity Framework Core** (ORM)
* **MySQL** (Banco de Dados Relacional)
* **Autenticação:** JWT (JSON Web Tokens) com controle baseado em Roles (Admin/Teacher).

### Frontend (SPA)
* **React.js**
* **Tailwind CSS** (Estilização responsiva e UI Components)
* **React Router Dom** (Navegação segura e protegida)

---

## Guia de Uso (Como a ferramenta funciona na prática)

O ciclo de vida do Stellify foi pensado para ser simples para o professor e valioso para a escola:

1. **Setup Inicial (Admin):** O administrador acessa o sistema e cadastra os professores que terão acesso à plataforma.
2. **Criação de Turmas:** O professor faz login, cria sua turma e importa a lista de alunos direto de um arquivo Excel.
3. **Engajamento Diário:** Durante as aulas, o professor utiliza o painel de **Ranking** para dar estrelas aos alunos por boas ações, tarefas concluídas ou comportamento.
4. **Troca de Recompensas:** O professor cadastra itens na **Lojinha**. Quando um aluno atinge o valor, o professor realiza o resgate pelo sistema, debitando o saldo de estrelas automaticamente.
5. **Fechamento e Relatórios:** Ao fim de um período (ex: "1º Bimestre"), o professor clica em **Encerrar Ciclo**. O sistema salva as posições de todos, zera o placar e gera uma aba de **Relatórios** pronta para ser impressa em folha A4 e entregue aos pais na reunião.

---

## Como executar o projeto localmente

### Pré-requisitos
* [.NET 8 SDK](https://dotnet.microsoft.com/download)
* [Node.js e npm](https://nodejs.org/)
* [MySQL Server](https://dev.mysql.com/downloads/) em execução.

### Passo 1: Configurar o Banco de Dados (Backend)
1. Navegue até o diretório da API: `cd StudentRanking.Api`
2. No arquivo `appsettings.json`, atualize a `DefaultConnection` com as suas credenciais do MySQL local.
3. Execute as Migrations para criar as tabelas no banco:
   ```bash
   dotnet ef database update --project ../StudentRanking.Infrastructure --startup-project .
