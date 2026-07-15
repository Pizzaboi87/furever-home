# Furever Home

<img src="public/apple-icon.png" alt="Furever Home logo" width="88" />

A production-oriented pet shelter CRM and public adoption platform built with Next.js, TypeScript, GraphQL, Prisma, PostgreSQL, Auth0, Cloudinary, Stripe, and Resend.

[Live demo](https://weiser-furever.vercel.app) · [Features](#features) · [Architecture](#architecture) · [Local setup](#local-development) · [Testing](#testing)

> Furever Home is a portfolio application built around fictional shelter data. Stripe runs in test mode, staff access is protected through Auth0, and the application is designed to demonstrate production-oriented architecture rather than operate a real shelter.

## Overview

Furever Home combines two connected products in one application:

- a public adoption website where visitors can browse available animals, open pet-specific inquiry workflows, volunteer, and start one-time or recurring donations;
- an authenticated shelter CRM where staff manage pets, people, cases, applications, notes, interactions, follow-ups, tasks, privacy workflows, publication state, and operational analytics.

The project was deliberately designed beyond a basic CRUD exercise. The system has explicit domain boundaries, structured case subtypes, audit-oriented records, shared publication rules, external provider integrations, server-side validation, destructive-action safeguards, database-backed rate limiting, automated browser tests, controlled seed tooling, and a production migration workflow.

## Live demo

[https://weiser-furever.vercel.app](https://weiser-furever.vercel.app)

The public site is accessible without authentication. The admin workspace requires an Auth0 session, and the authenticated identity must also resolve to an active `StaffUser` record in PostgreSQL.

## Features

### Public adoption website

- Responsive home, about, volunteer, donate, browse, pet detail, success, cancellation, and custom 404 pages
- Database-backed pet catalogue with filters for species, gender, size, lifecycle status, and household compatibility
- Shared public-visibility policy that prevents unpublished, hidden, inactive, or adopted pets from appearing publicly
- Pet-specific adoption, virtual adoption, and question workflows
- General contact and volunteer application workflows
- One-time and recurring Stripe Checkout sessions in test mode
- Resend-powered shelter notifications with structured HTML emails and reply-to handling
- Responsive inquiry modals with validation, success/error feedback, and background scroll locking
- Next.js image optimization with Cloudinary-hosted pet images
- Mobile navigation and responsive public page layouts

### Shelter CRM

- Auth0-protected staff workspace with database-backed staff authorization
- Operational dashboard with selectable historical months
- KPI summaries, application pipeline, intake/adoption activity, donation trends, volunteer activity, waitlist signals, and activity history
- Case management with type, scope, status, priority, owner, outcome, source channel, related person, optional related pet, and next follow-up
- Structured case records for adoption applications, virtual adoptions, donation inquiries, and volunteer applications
- Staff-only notes, inbound/outbound interactions, lifecycle events, and audit-friendly timelines
- Pet management with Cloudinary upload, cropping, image ordering, publication controls, lifecycle history, and guarded deletion
- People management with profile editing, household data, related cases, related pets, interaction history, and GDPR-style anonymization
- Task buckets for overdue, due-today, and upcoming follow-ups
- Desktop tables and dedicated mobile card layouts
- Real staff attribution for admin writes and activity records
- Controlled empty states, loading states, toasts, and destructive-action confirmation flows

### Case and workflow coverage

The case system supports multiple operational topics rather than a single generic record type:

- general questions;
- pet-specific questions;
- adoption applications;
- virtual adoptions;
- donation support;
- volunteer applications;
- event follow-ups;
- surrender requests;
- lost-and-found reports;
- medical updates;
- miscellaneous operational cases.

Cases can exist with or without a related pet, but always belong to a person/contact. They can also carry structured application data, notes, interactions, timeline events, follow-up dates, ownership, outcomes, and priority.

### Domain safeguards

Examples of enforced business rules include:

- inactive or historical pets cannot receive new open cases;
- inactive pets cannot be published;
- public visibility is derived from publication state and lifecycle state together;
- a pet with an open adoption application cannot be deactivated;
- adoption completion is restricted to valid workflow states;
- closed cases require an outcome;
- closed cases cannot be reopened through general case management;
- closure clears obsolete follow-up data;
- structured application records cannot be edited after case closure;
- anonymized contacts cannot be edited or anonymized again;
- contacts with active cases cannot be anonymized;
- destructive actions require exact-name confirmation;
- invalid GraphQL or provider output never bypasses domain validation.

## Technology stack

### Application platform

| Technology                | Role in the project                                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 App Router** | Public and admin routing, Server Components, Client Components, route handlers, server actions, optimized production builds, and image optimization |
| **React 19**              | Interactive UI, forms, modals, client state, responsive navigation, and reusable feature components                                                 |
| **TypeScript 5.7**        | End-to-end static typing across UI, GraphQL contracts, services, domain models, seed tooling, scripts, and tests                                    |
| **Tailwind CSS 4**        | Responsive layouts, design system utilities, public/admin styling, mobile variants, and visual consistency                                          |
| **Base UI**               | Accessible lower-level UI behavior used by interactive controls                                                                                     |
| **Lucide React**          | Consistent iconography across the public and admin interfaces                                                                                       |
| **Framer Motion**         | Controlled transitions and interaction animation, with reduced behavior on smaller viewports                                                        |
| **react-hot-toast**       | Success and error feedback for public and authenticated workflows                                                                                   |

### Data and backend

| Technology                      | Role in the project                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL on Aiven**         | Persistent relational storage for users, pets, people, cases, notes, interactions, applications, analytics, and operational history    |
| **Prisma 7**                    | Schema definition, typed database access, migrations, seed orchestration, relations, transactions, and production migration deployment |
| **Prisma Accelerate**           | Managed serverless connection pooling in front of Aiven PostgreSQL for Vercel runtime queries                                           |
| **`@prisma/adapter-pg` + `pg`** | Direct PostgreSQL access used by Prisma CLI operations, migrations, seed tooling, and local database workflows                           |
| **GraphQL Yoga**                | Application API boundary for admin and public queries/mutations                                                                        |
| **GraphQL 16**                  | Typed query/mutation schema and transport contracts                                                                                    |
| **Zod 4**                       | Environment validation, form input validation, mutation input validation, domain boundary checks, and safe parsing                     |
| **dotenv**                      | Controlled environment loading for scripts, tests, and local tooling                                                                   |

### External services

| Service              | Integration                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Auth0**            | Staff login, session management, route protection, and identity mapping to active database staff records                      |
| **Cloudinary**       | Pet image upload, storage, delivery, crop metadata, image ordering, and seed-time image migration                             |
| **Stripe Checkout**  | One-time and monthly donation sessions in test mode, with success and cancellation routes                                     |
| **Resend**           | Transactional shelter notifications for contact, adoption, virtual adoption, question, and volunteer submissions              |
| **Aiven PostgreSQL** | Hosted persistent database used by the deployed demo and authenticated E2E mutation tests                                     |
| **Vercel**           | Production hosting, serverless route execution, image optimization, environment configuration, and scheduled demo maintenance |

### Data visualization and media

| Technology           | Role in the project                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Apache ECharts 6** | Dashboard charts for applications, donations, intake/adoption history, and operational activity |
| **`next/image`**     | Responsive image loading, sizing, optimization, and LCP handling                                |
| **react-easy-crop**  | Admin-side pet image cropping before Cloudinary upload                                          |

### Quality and testing

| Technology                        | Role in the project                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Playwright**                    | Public, authenticated read-only, and authenticated mutation browser tests                            |
| **Node test runner + tsx**        | Fast TypeScript unit tests for domain logic, validation, mappers, serializers, and utilities         |
| **ESLint 9 + eslint-config-next** | Static code-quality and React Hook checks                                                            |
| **TypeScript compiler**           | Strict project-wide type checking with `tsc --noEmit`                                                |
| **GitHub Actions**                | Automated install, Prisma generation, unit tests, lint, typecheck, and production-build verification |

## Architecture

```text
Public UI                              Admin UI
   │                                     │
   │ public forms / GraphQL reads        │ authenticated server actions
   │                                     │
   └───────────────┬─────────────────────┘
                   ▼
             GraphQL Yoga API
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
 Read/query services     Write services
        │                     │
        │              Zod input validation
        │                     │
        └──────────┬──────────┘
                   ▼
             Domain policies
       lifecycle · privacy · publication
       status transitions · audit rules
                   │
                   ▼
                Prisma
                   │
                   ▼
          Aiven PostgreSQL

External boundaries:
Auth0 · Cloudinary · Stripe · Resend
```

### Read flow

A typical admin read follows this path:

```text
Server Component
→ GraphQL query
→ GraphQL resolver
→ query service
→ Prisma
→ PostgreSQL
→ GraphQL mapper
→ client-safe plain-data serializer
→ UI
```

Prisma objects, dates, bigint values, and nullable fields are normalized before data crosses into Client Components.

### Write flow

A typical authenticated admin mutation follows this path:

```text
Admin form
→ server action
→ Zod validation
→ authenticated GraphQL mutation
→ write service
→ domain guard
→ Prisma transaction
→ audit/event records
→ cache revalidation / redirect / toast
```

UI code does not write directly to Prisma. This keeps validation, permissions, lifecycle rules, and audit behavior centralized.

### External integration flow

```text
Public inquiry
→ route handler
→ Zod validation
→ abuse protection
→ Resend

Donation form
→ route handler
→ amount validation
→ abuse protection
→ Stripe Checkout

Admin image workflow
→ authenticated upload route
→ file validation and crop data
→ Cloudinary
→ PetImage record
```

Provider errors are logged server-side. Client responses use safe generic messages rather than leaking credentials, provider internals, or configuration details.

## Data model

The Prisma schema contains dedicated models for:

### Identity and access

- `StaffUser`
- `Account`
- `Session`
- `VerificationToken`

### Shelter contacts and animals

- `Person`
- `Pet`
- `PetImage`
- `ShelterEvent`
- `PetStatusEvent`

### Case management

- `ShelterCase`
- `CaseInteraction`
- `CaseNote`
- `CaseEvent`

### Structured workflows

- `AdoptionApplication`
- `VirtualAdoption`
- `DonationInquiry`
- `VolunteerApplication`
- `VolunteerHours`

### Analytics and operations

- `ActivityEvent`
- `DashboardAnalyticsRecord`
- `ApiRateLimit`
- `DemoDateShiftRun`

The schema also uses enums for staff roles, case types, case statuses, priorities, communication channels, pet lifecycle state, public publication state, profile types, volunteer status, donation frequency, background-check state, and related workflow values.

## Project structure

```text
app/                         Next.js routes, layouts, pages, API routes, and route entries
actions/admin/               Authenticated server actions grouped by feature
components/admin/            Admin feature components and reusable CRM UI
components/pets/             Public pet cards, filters, and pet detail content
components/public-inquiry/   Shared public inquiry forms and modals
components/ui/               Reusable visual primitives
lib/admin/                   Admin domain logic, input schemas, mappers, and services
lib/graphql/                 GraphQL schema, resolvers, query/mutation clients, and serializers
lib/server/                  Prisma client, environment validation, rate limiting, and server-only integrations
prisma/schema.prisma         Relational database schema
prisma/migrations/           Versioned database migrations
prisma/seed.ts               Seed entry point
prisma/seed/                 Seed modules, normalizers, validators, and upload helpers
prisma/seed-data/            JSON data used only by the seed process
prisma/seed-assets/          Local images used only during Cloudinary seeding
scripts/                     Operational and maintenance scripts
tests/unit/                  Domain, validation, mapper, serialization, and utility tests
tests/e2e/                   Public, authenticated, and mutation browser tests
docs/                        Architecture, email, testing, and deployment documentation
```

Seed-only data and images are intentionally outside `public/`. They are not runtime assets and are not exposed as public URLs by the deployed application.

## Local development

### Requirements

- Node.js 22 or later
- npm
- PostgreSQL database
- Auth0 application
- Cloudinary account
- Stripe test-mode account
- Resend account

### Installation

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
```

Apply committed migrations without deleting data:

```bash
npm run prisma:migrate:deploy
```

Populate a clean demo database:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```dotenv
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgresql://...aiven..."
SHADOW_DATABASE_URL=

APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

STRIPE_SECRET_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
RESEND_LOGO_URL=

CRON_SECRET=
```

`DATABASE_URL` is the Prisma Accelerate runtime URL used by the deployed application. `DIRECT_DATABASE_URL` is the direct Aiven PostgreSQL connection used by Prisma CLI commands, migrations, introspection, and seed tooling. `CRON_SECRET` must contain at least 32 characters. Real credentials, `.env.local`, `.env.playwright.local`, and Playwright authentication state must never be committed.

## Database and seed workflow

### Apply migrations while preserving data

```bash
npm run prisma:migrate:deploy
```

This applies committed migrations that have not yet run. It is the correct workflow for Aiven and production-like databases.

### Reset a disposable database

```bash
npx prisma migrate reset --force
npm run db:seed
```

This deletes existing data, reapplies every migration, and rebuilds the controlled demo dataset. It should only be used when a complete reset is intentional.

### Seed sources

```text
prisma/seed-data/pets.json
prisma/seed-data/shelter-data.json
prisma/seed-assets/pets/
```

The seed process validates and normalizes its source data before persistence. When Cloudinary credentials are present, local pet images are uploaded and persisted as `PetImage` records. Runtime pages read image URLs from PostgreSQL rather than serving seed assets directly.

The controlled seed includes staff users, people, current and historical pets, cases, interactions, notes, structured application records, status history, activities, donations, volunteer records, and dashboard analytics.

## Testing

### Unit tests

```bash
npm run test:unit
```

The TypeScript unit suite covers:

- case input normalization and validation;
- case lifecycle and closure rules;
- structured case record restrictions;
- pet lifecycle and publication policy;
- public pet visibility;
- person privacy and anonymization guards;
- GraphQL-to-domain and domain-to-GraphQL mappers;
- JSON scalar behavior;
- Client Component-safe serialization;
- inquiry validation and normalization;
- API rate-limit utilities;
- deterministic incoming-case preview generation.

Current baseline: **96 passing unit tests**.

### Public and authenticated read-only E2E tests

```bash
npm run test:e2e:all
```

Coverage includes:

- public route rendering;
- admin route protection;
- Auth0 setup and authenticated admin access;
- public GraphQL pet queries;
- browse filtering and reset behavior;
- inquiry validation and mocked provider failures;
- adoption and virtual adoption forms;
- Stripe checkout error recovery;
- admin route smoke tests;
- destructive-action confirmation guards;
- public and admin mobile navigation.

Current baseline: **35 passing read-only E2E tests**.

### Authenticated mutation E2E tests

```bash
npm run test:e2e:mutations
```

This suite operates through the real admin UI and database. It verifies:

- person creation and editing;
- draft pet creation and editing;
- case creation linked to a person;
- follow-up scheduling and status changes;
- pet publishing and unpublishing;
- internal note creation;
- exact-record cleanup after the run.

Current baseline: **9 passing mutation E2E tests**.

### Complete local verification

```bash
npm run verify
```

This runs:

1. Prisma schema validation;
2. all unit tests;
3. ESLint;
4. TypeScript checking;
5. an optimized production build.

Authenticated browser suites remain separate because they require Auth0 credentials and a live database.

## Security and resilience

- Auth0 protects staff routes and sessions.
- Authenticated identities must map to active database staff records.
- Secrets are server-only and validated at startup or service boundaries.
- Zod validates environment variables and write inputs.
- Contact and Stripe endpoints use database-backed rate limiting.
- Cloudinary uploads require authenticated staff access and file validation.
- Provider internals are never returned directly to clients.
- Destructive actions require exact-name confirmation.
- GDPR anonymization preserves operational history while removing personal data.
- GraphQL output is converted to safe serializable data before reaching Client Components.
- Mutation E2E records use unique identifiers and targeted cleanup.
- Playwright auth state, reports, generated output, and environment files are excluded from Git.

## Rolling demo timeline

The application includes a protected maintenance operation that advances the entire fictional business timeline by one day:

```text
GET /api/cron/shift-demo-dates
Authorization: Bearer <CRON_SECRET>
```

The shift runs inside one database transaction and keeps related dates aligned across pets, people, cases, notes, interactions, applications, donations, volunteer records, activity events, and dashboard analytics.

Technical expiry data is excluded, including Auth0 sessions, verification tokens, API rate-limit windows, and the shift job's own execution history.

`DemoDateShiftRun` makes the operation idempotent per UTC day, preventing duplicate cron calls from shifting the dataset twice.

A deliberate manual shift can be triggered with:

```bash
npm run demo:shift-dates
```

## Deployment

The production architecture is:

```text
GitHub
→ GitHub Actions verification
→ Vercel deployment
→ Prisma Accelerate connection pool
→ Aiven PostgreSQL
→ Auth0 / Cloudinary / Stripe / Resend
```

The production deployment includes:

1. configuring production environment variables in Vercel;
2. applying committed Prisma migrations with `npm run prisma:migrate:deploy`;
3. configuring Auth0 callback, logout, and allowed-origin URLs;
4. validating Cloudinary upload and image delivery;
5. validating Stripe test Checkout and return routes;
6. validating Resend delivery and reply-to behavior;
7. configuring the protected daily date-shift request;
8. running public and authenticated smoke tests against the deployed domain.

## Known limitations

- The application uses fictional demo data and does not represent a real shelter.
- Stripe remains in test mode.
- Public inquiries send staff emails but do not automatically create CRM cases.
- The rolling date shift is intentionally specific to maintaining a fresh portfolio demo timeline.
- Some moderate transitive dependency audit findings originate in framework or Prisma tooling. Breaking forced downgrades are intentionally avoided.

## License

This repository is a personal portfolio project. Its fictional shelter data and demo content are provided for demonstration purposes only.
