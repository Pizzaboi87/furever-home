# Deployment readiness checklist

This checklist is the required path from a green local project to the first production deployment.

## 1. Local verification

Install dependencies, generate Prisma Client, and run the complete non-destructive verification pipeline:

```bash
npm install
npm run prisma:generate
npm run verify
```

`npm run verify` runs:

1. Prisma schema validation;
2. all fast unit tests;
3. ESLint;
4. TypeScript checking;
5. the optimized Next.js production build.

Run the browser suites separately because authenticated and mutation tests require credentials and a live database:

```bash
npm run test:e2e
npm run test:e2e:auth
npm run test:e2e:mutations
```

The mutation suite creates uniquely prefixed records and removes them after the run. Do not interrupt it during cleanup.

## 2. Environment variables

Copy `.env.example` for local setup and configure the same variables in the deployment platform:

```bash
cp .env.example .env.local
```

Required production groups:

- application URL: `APP_BASE_URL`, `NEXT_PUBLIC_APP_URL`;
- PostgreSQL runtime through Prisma Accelerate: `DATABASE_URL`;
- direct Aiven PostgreSQL access for Prisma CLI, migrations, introspection, and seed tooling: `DIRECT_DATABASE_URL`;
- Auth0: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`;
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`;
- Stripe: `STRIPE_SECRET_KEY`;
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`.

Never commit real secrets, `.env.local`, `.env.playwright.local`, or Playwright authentication state.

## 3. Database preparation

The deployed application uses Prisma Accelerate in front of the live Aiven PostgreSQL database. `DATABASE_URL` must contain the generated `prisma://...` Accelerate URL, while `DIRECT_DATABASE_URL` must contain the direct Aiven `postgresql://...` URL.

Confirm that `prisma.config.ts` reads `DIRECT_DATABASE_URL`, then validate the schema and inspect pending migrations:

```bash
npm run prisma:validate
npx prisma migrate status
```

Apply committed migrations in the deployment environment:

```bash
npm run prisma:migrate:deploy
```

Do not use `prisma migrate dev` against the production database.

The production seed must be an explicit, controlled operation. Review the seed dataset and target database before running:

```bash
npm run db:seed
```

## 4. Auth0 production configuration

Configure the production application URL in Auth0 for:

- allowed callback URLs;
- allowed logout URLs;
- allowed web origins.

Confirm that the production staff account email matches an active `StaffUser` record so the application can resolve the authenticated actor and audit trail.

## 5. External services

### Cloudinary

Confirm image upload, display, replacement, and deletion with the production credentials.

### Stripe

Keep Stripe in test mode for the demo deployment. Verify one-time and monthly checkout, success return, and cancel return.

### Resend

Use a verified sender domain. Verify each public form and confirm that staff emails arrive with the expected reply-to and content.

## 6. Deployment

Before the first Vercel deployment:

1. push the verified source to GitHub;
2. connect the repository to Vercel;
3. configure every required environment variable, including both the Accelerate runtime URL and the direct Aiven URL;
4. confirm Prisma Accelerate is enabled with a conservative connection-pool size appropriate for the Aiven plan;
5. apply database migrations through `DIRECT_DATABASE_URL`;
6. deploy the production build;
7. verify that no seed or development-only command runs automatically during build.

## 7. Live smoke test

After deployment, verify:

- public home, browse, pet detail, donate, volunteer, about, and 404 routes;
- Auth0 login and logout;
- Dashboard, Tasks, Cases, Pets, and People;
- person, pet, and case creation with cleanup;
- case note, follow-up, status update, pet publish/unpublish;
- Cloudinary image operations;
- Stripe test checkout;
- Resend form delivery;
- mobile navigation and primary mobile layouts.

Run the non-destructive Playwright suites against the deployed URL:

```bash
PLAYWRIGHT_BASE_URL=https://your-domain.example npm run test:e2e
PLAYWRIGHT_BASE_URL=https://your-domain.example npm run test:e2e:auth
```

Only run mutation tests against production when the dedicated test account and cleanup behavior have been explicitly approved.


## Security and abuse protection

- [ ] Apply the `ApiRateLimit` migration with `npm run prisma:migrate:deploy` before enabling public traffic.
- [ ] Confirm `/api/contact` returns HTTP 429 after 5 requests from the same client within 10 minutes.
- [ ] Confirm `/api/stripe/checkout` returns HTTP 429 after 10 requests from the same client within 10 minutes.
- [ ] Confirm Cloudinary upload failures return a generic client message while the detailed error is only logged server-side.
- [ ] Confirm `.env`, Playwright auth state, reports, and TypeScript build cache are ignored by Git.
- [ ] Confirm GitHub Actions `CI` passes on the default branch.

## Dependency audit note

The current moderate npm audit findings are transitive through Prisma tooling and Next.js/PostCSS. Do not run `npm audit fix --force`, because npm proposes breaking downgrades. Re-check after compatible Prisma and Next.js patch releases, and upgrade through normal dependency review.
