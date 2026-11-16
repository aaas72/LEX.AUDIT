# LEX.AUDIT

AI-powered legal-tech platform that audits contracts for risky clauses — such as perpetual non-competes or one-sided IP transfers — and translates legalese into clear, actionable insight.

![Angular](https://img.shields.io/badge/Angular_18-DD0031?style=flat-square&logo=angular&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=flat-square&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=flat-square&logo=csharp&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## How It Works

1. **Upload** a contract (PDF) through the Angular client.
2. **Extract** — the API parses the document text with PdfPig and sanitizes it.
3. **Analyze** — an audit pipeline sends the text to Google Gemini, constrained to return strict JSON instead of free-form prose.
4. **Deliver** — results are persisted and pushed back to the client in real time over SignalR, then rendered as a health score, severity-ranked findings and suggested rewrites.

## Features

- Clause-level risk detection with severity levels and an overall contract health score
- Plain-language explanations and suggested safer wording for each flagged clause
- Real-time progress and results via WebSockets (SignalR hub)
- JWT authentication with BCrypt password hashing
- Distinctive "editorial brutalism" UI — monochrome palette on a Swiss typographic grid

## Architecture

The backend follows **Clean Architecture**:

```text
server/src/
├── LexAudit.Domain/          # Entities, enums, value objects — no dependencies
├── LexAudit.Application/     # Use cases, DTOs, interfaces, audit pipeline
├── LexAudit.Infrastructure/  # EF Core persistence, migrations, PDF parsing, AI client
├── LexAudit.Api/             # Controllers, SignalR hubs, auth, OpenAPI/Swagger
└── LexAudit.Tests/           # NUnit + Moq unit tests

client/                       # Angular 18 + Tailwind CSS, served by Nginx
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design document.

## Getting Started

**Requirements:** .NET SDK, Node.js 20+, a Google Gemini API key

```bash
# API
cd server
dotnet restore
dotnet run --project src/LexAudit.Api

# Client (in a second terminal)
cd client
npm install
npm start
```

Or run everything with Docker:

```bash
docker compose up --build
```

Run the tests:

```bash
cd server && dotnet test
```

## Author

**Abdellah Sheikh** — [abdellahsheikh.dev](https://abdellahsheikh.dev) · [LinkedIn](https://www.linkedin.com/in/abdellahsheikh)
