# LEX.AUDIT: Elite AI-Powered Legal-Tech SaaS

## 1. Project Identity & Philosophy

* **Project Name:** LEX.AUDIT
* **The Anti-AI Aesthetic:** A complete departure from overused SaaS templates and generic AI aesthetics (no excessive whitespace, floating cards, or soft drop shadows). 
* **Editorial Brutalism:** Adopting a strict, monochromatic visual identity (Muted Mustard & Charcoal) built on Swiss typographic grids. The UI resembles a modern, authoritative legal document utilizing "IBM Plex Sans" to instill a deep sense of security, responsibility, and trust.
* **User Empowerment:** Beyond merely flagging dangerous clauses (e.g., perpetual non-competes, one-sided IP transfers), the platform translates archaic legalese into actionable business intelligence and provides balanced, ready-to-use "Suggested Fixes" for contract negotiation.
* **Strict Data Structuring:** Taming the AI (Google Gemini) to output strictly formatted JSON data rather than conversational text, backed by a highly resilient architecture that ensures data integrity and high performance.

---

## 2. Executive Summary
This document outlines the complete technical architecture for **LEX.AUDIT**, a B2B/B2C SaaS platform designed to perform automated legal risk auditing. The system ingests legal contracts, processes them using a strictly constrained AI model, and outputs highly structured JSON data. The platform is built for high concurrency, strict type safety, and real-time frontend reactivity.

---

## 3. Complete Technology Stack

### Frontend (Client Layer)
* **Framework:** Angular (v17+) using Standalone Components, modern Control Flow syntax, and Signals for reactive, granular state management.
* **UI/UX Framework:** Tailwind CSS, configured strictly for the monochromatic color palette, utilizing CSS Grid for brutalist, editorial layouts.

### Backend (API Layer)
* **Framework:** ASP.NET Core Web API (C#) implementing Clean Architecture principles.
* **Real-time Communication:** SignalR for WebSocket integration.

### Database & Storage
* **Primary Database:** PostgreSQL (Relational + Document hybrid approach).
* **ORM:** Entity Framework (EF) Core.

### AI Engine
* **Model:** Google Gemini API.
* **Configuration:** Restricted to `response_mime_type: "application/json"` for deterministic data extraction.

### DevOps & CI/CD
* **Containerization:** Docker.
* **Pipelines:** YAML-based GitHub Actions for automated testing and deployment.

---

## 4. Core System Components & Architecture

### A. The Angular Frontend Application
* **State Management:** Utilizing Angular Signals to manage the complex, highly nested JSON states returned by the backend efficiently.
* **Internationalization (i18n):** Native i18n or `ngx-translate` to handle seamless switching between English, Arabic, and Turkish, ensuring strict layout integrity (LTR to RTL) on the typographic grid.
* **Component Architecture:** 
  * `DocumentUploaderComponent`: Handles multi-part file uploads with strict MIME type validation (PDF, DOCX).
  * `AuditDashboardComponent`: Renders the grid-based UI, health scores, and severity warnings.
  * `ClauseVisualizerComponent`: Iterates over the backend JSON response to display original text vs. suggested rewrites.

### B. The ASP.NET Core API Backend
* **Architecture Pattern:** Clean Architecture with CQRS (Command Query Responsibility Segregation) using MediatR.
* **Ingestion Service:** Utilizes C# libraries (e.g., `iText7` or `DocX`) to extract raw text from uploaded files, stripping out unnecessary formatting and sanitizing the payload.
* **Background Processing:** The API utilizes .NET `IHostedService` (or Hangfire) to queue the AI processing task to prevent HTTP request blocking, returning a `202 Accepted` status with a `JobId` to the client.
* **Real-time Delivery:** SignalR pushes the completed JSON audit back to the Angular client via WebSockets once the background AI job finishes.

---

## 5. Database Schema Design (PostgreSQL + EF Core)

The database leverages PostgreSQL's dual capability of handling rigid relational data alongside flexible document data.

| Table Name | Description | Key Columns (Types) |
| :--- | :--- | :--- |
| **Users** | Core authentication and tenant identity. | `Id` (UUID), `Email` (Varchar), `PasswordHash` (Varchar), `Tier` (Enum) |
| **Contracts** | Metadata for uploaded documents. | `Id` (UUID), `UserId` (UUID - FK), `FileName` (Varchar), `UploadDate` (Timestamp) |
| **Audits** | The core results table. | `Id` (UUID), `ContractId` (UUID - FK), `Status` (Enum), `HealthScore` (Int), **`AuditData` (JSONB)** |

> **Note:** The `AuditData` column uses PostgreSQL's native `JSONB` type. This allows the backend to store the exact, deeply nested JSON output from Gemini and run high-speed queries directly on the JSON keys (e.g., finding all contracts with high-severity clauses).

---

## 6. AI Integration & Prompt Engineering

* **The Pipeline:** The sanitized text is wrapped in a highly restrictive system prompt enforcing the legal-tech persona and strict JSON adherence.
* **Schema Enforcement:** The backend defines a C# `record` or `class` that mirrors the expected JSON structure. When Gemini returns the payload, the backend attempts to deserialize it into this C# object using `System.Text.Json`. 
* **Error Handling & Fallback:** If deserialization fails (due to AI hallucination), the backend catches the exception and triggers an automatic retry mechanism with lower temperature settings.

---

## 7. Security & Infrastructure Protocols

* **Authentication:** JWT (JSON Web Tokens) issued by the ASP.NET backend, stored securely on the Angular client.
* **Rate Limiting:** Implemented via ASP.NET Core's native rate-limiting middleware to prevent API abuse and control Gemini API costs.
* **Data Privacy:** Uploaded contract texts are transient. They are sent to the AI, the JSON result is saved, and the original raw text/file is aggressively purged from the server memory and storage to ensure strict legal confidentiality.

---

## 8. DevOps & Deployment Strategy

* **Containerization:** Both the Angular application (served via Nginx) and the ASP.NET Core API are wrapped in isolated Docker containers.
* **CI/CD Pipeline:** A YAML-based GitHub Actions workflow triggers on every push to the `main` branch. The pipeline executes unit tests, builds the Docker images, and pushes them to a container registry.
* **Hosting:** The containers and the managed PostgreSQL database are deployed to a robust cloud environment (e.g., AWS ECS, DigitalOcean App Platform, or Azure Container Apps).