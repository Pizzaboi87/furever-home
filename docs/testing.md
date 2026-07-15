# Testing

## Playwright installation

Install project dependencies and the Chromium browser:

```bash
npm install
npm run test:e2e:install
```

## Non-destructive public and access-protection smoke tests

Run the smoke suite against the local Next.js development server:

```bash
npm run test:e2e
```

Playwright starts the app on `http://127.0.0.1:3000` automatically and reuses an already running local server outside CI.

Run against an existing deployment or manually started server:

```bash
PLAYWRIGHT_BASE_URL=https://example.com npm run test:e2e
```

The base smoke suite is non-destructive. It covers public routes, the custom 404 page, mobile navigation, unauthenticated admin route protection, and the public pets GraphQL query.

## Authenticated admin read-only smoke tests

Use a dedicated active Auth0 staff test account. Do not use a personal production account.

Set the credentials in the shell that starts Playwright:

```bash
export PLAYWRIGHT_AUTH0_EMAIL="staff-test@example.com"
export PLAYWRIGHT_AUTH0_PASSWORD="replace-with-test-password"
```

Run the authenticated admin suite:

```bash
npm run test:e2e:auth
```

The setup project signs in through Auth0 and stores the temporary browser session in `playwright/.auth/staff.json`. This directory is ignored by Git and must never be committed.

The authenticated suite is read-only. It verifies that an active staff account can load Dashboard, Cases, Pets, People, and Tasks without redirecting back to the login page.

Run the base and authenticated suites together:

```bash
npm run test:e2e:all
```

Run the authenticated suite with a visible browser when debugging the Auth0 flow:

```bash
npm run test:e2e:auth:headed
```

If Auth0 requires MFA, CAPTCHA, or an organization selection, use a dedicated test tenant/account configured for automated testing or create the storage state interactively before running the read-only suite.

## Other useful commands

```bash
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:e2e:report
```

Database-mutating CRUD and workflow tests are intentionally not enabled yet. They require a resettable isolated test database and deterministic seed lifecycle.

## Authenticated test credentials

Copy `.env.playwright.example` to `.env.playwright.local` and provide a dedicated active Auth0 staff account:

```bash
cp .env.playwright.example .env.playwright.local
```

```dotenv
PLAYWRIGHT_AUTH0_EMAIL=staff-test@example.com
PLAYWRIGHT_AUTH0_PASSWORD=replace-with-test-account-password
```

Playwright loads `.env.playwright.local` automatically. The file is ignored by Git through the existing `.env.*.local` rule. Environment variables supplied directly in the shell still take precedence.

Before retrying authentication after changing credentials or Auth0 configuration, remove the stored browser session:

```bash
rm -f playwright/.auth/staff.json
npm run test:e2e:auth:headed
```


## Authenticated mutation smoke tests

These tests create a uniquely named person, draft pet, general case, and internal note through the real admin UI. They also verify person and pet profile editing, case follow-up management, and the pet publication lifecycle. They also verify case follow-up scheduling plus the pet publish/unpublish lifecycle. They then remove only the records whose exact IDs were captured during the run.

They are separated from the read-only suites and require an explicit safety flag. Use:

```bash
npm run test:e2e:mutations
```

For a visible browser:

```bash
npm run test:e2e:mutations:headed
```

The npm scripts set `PLAYWRIGHT_MUTATION_TESTS=true` automatically. The suite still requires the Auth0 credentials configured in `.env.playwright.local`.

Do not interrupt the process during cleanup. If a run is interrupted, the created records are easy to identify because their names and subjects start with `PW-E2E`.

## Fast unit tests

The unit suite uses Node's built-in test runner through the existing `tsx` development dependency, so no additional test framework is required.

Run all unit tests:

```bash
npm run test:unit
```

Watch the unit tests while changing domain logic:

```bash
npm run test:unit:watch
```

The first unit layer covers pet publication and visibility rules, case lifecycle and transition validation, person privacy guards, and pet adoption workflow guards. These tests do not require Auth0, a browser, or a database connection.

## Validation unit tests

The unit suite also covers the Zod input contracts used by admin person, pet, and case writes. These tests verify trimming and normalization, required fields, allowed enum values, non-negative numeric inputs, ISO date validation, nested pet image metadata, follow-up inputs, application fields, and adoption workflow actions.

Run the complete fast unit suite with:

```bash
npm run test:unit
```

## GraphQL serialization and mapper unit tests

The unit suite also protects the GraphQL boundary without starting the application or connecting to the database. It verifies:

- conversion of dates, bigint values, `undefined`, `NaN`, and `toJSON()` values into Client Component-safe plain data;
- rejection of circular references and unsupported class instances with useful paths;
- domain-to-GraphQL defaults and nullable field normalization;
- GraphQL-to-domain conversion of nullable API values back into optional domain values;
- pet image, case, person, timeline, note, and activity mapper contracts.

Run them with the regular unit suite:

```bash
npm run test:unit
```

### Public inquiry, JSON scalar, and case preview contracts

The unit suite also covers public inquiry normalization and conditional requirements, the GraphQL JSON scalar literal parser, and deterministic incoming-case preview generation. These tests remain database-free and run as part of `npm run test:unit`.

## Complete local verification

Use the deploy-readiness verification command before pushing or deploying:

```bash
npm run verify
```

This validates the Prisma schema, runs all unit tests, lints the project, performs TypeScript checking, and creates the optimized production build. Authenticated and mutation Playwright suites remain separate because they require external credentials and a live database.

## Public workflow E2E coverage

The Chromium smoke project also covers deterministic public user workflows with mocked external endpoints:

- browse category filtering and reset
- volunteer inquiry success and request payload
- footer contact error handling
- pet question modal success and pet context
- donation frequency/amount selection and Stripe checkout error recovery

The tests intercept `/api/contact` and `/api/stripe/checkout`, so they do not send real email or create a real Stripe Checkout session.


### Additional public and admin form guards

The non-destructive Playwright projects also verify that empty required public forms do not call the API, start-adoption and virtual-adoption payloads are normalized correctly, the new-person action remains disabled until a valid name is entered, and the new-pet creation actions render without submitting data.

### Additional safety guard coverage

The read-only Playwright suites also verify public modal scroll locking, browser-level invalid email blocking, destructive admin confirmation guards for pet deletion and GDPR anonymization, and the authenticated mobile admin menu. These tests never click the destructive actions and do not modify database records.
