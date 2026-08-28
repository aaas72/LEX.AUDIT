# LEX.AUDIT Backend

The LEX.AUDIT backend is an ASP.NET Core Web API implementing the core legal document analysis engine using Clean Architecture.

## Architecture

- **Domain Layer**: Contains core entities (`AuditReport`, `AuditFinding`, `Contract`), Enums (`RiskLevel`, `UserRole`), and core business abstractions.
- **Application Layer**: Contains the orchestration logic (`AuditOrchestrator`) and the 8-stage Audit Pipeline, plus interfaces (`IPdfExtractor`, `IGeminiProvider`, `IAuditProgressNotifier`).
- **Infrastructure Layer**: Implements cross-cutting concerns:
  - `PdfExtractorService` (Using UglyToad.PdfPig for text extraction)
  - `GeminiProvider` (Integration with Google AI Studio Gemini 2.5 Pro via REST)
  - `AppDbContext` (EF Core SQLite Database)
- **Api Layer**: Exposes endpoints (`ContractsController`, `UserController`) and real-time hubs (`AuditHub` using SignalR). Registers all dependencies.

## Prerequisites

- .NET 10.0 SDK
- SQLite (built-in EF Core provider)

## Setup & Run

1. Navigate to `src/LexAudit.Api`.
2. Configure the Gemini API Key in `appsettings.json` (or via user secrets):
   ```json
   "Gemini": {
     "ApiKey": "YOUR_GEMINI_API_KEY"
   }
   ```
3. Run the migrations (if not already applied):
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
5. Navigate to `https://localhost:<port>/swagger` to view the API documentation.

## Audit Pipeline Stages

0. **Gatekeeper Validator**: Verifies subscription quota and basic file integrity.
1. **Structural Extractor**: Extracts clauses and paragraphs from the PDF.
2. **Document Graph Builder**: Constructs the initial node graph for findings.
3. **Clause Classifier**: Identifies the legal nature of each clause (e.g., Liability Cap).
4. **Risk Taxonomy Auditor**: Deterministically assigns risk scores based on the user's role (Client vs Service Provider).
5. **Deep Legal Reasoner**: Evaluates high-risk clauses for loopholes using Gemini AI.
6. **Remediation Agent**: Suggests 3 redlined alternatives (Aggressive, Balanced, Minimal) using Gemini AI.
7. **Grounding Verifier**: Hallucination checker.
8. **Report Assembler**: Summarizes overall risk and finalizes the holistic executive summary.

## Real-Time Updates

Clients can connect to the `/hubs/audit` SignalR endpoint.
Join a group using `JoinContractGroup(contractId)`. Listen for the `ReceiveProgress` and `ReceiveError` events to get live updates on the pipeline stages.
