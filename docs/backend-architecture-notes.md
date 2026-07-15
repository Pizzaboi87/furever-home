# Furever Home backend architecture notes

This document records the backend migration history and current architecture. The application runtime is now Prisma-backed; JSON files under `prisma/seed-data/` are seed inputs only, and the legacy mock runtime has been removed.

## Demo boundary

The current demo does **not** need every public interaction to appear automatically in the admin CRM.

For the first backend version:

- **Pets are the shared source of truth** between admin and public pages.
- Admin-created pets must appear on the public browse/detail pages when they are published and adoptable.
- Admin pet edits must update the public pages, including status and image changes.
- Adopted or hidden pets should be removed from public listing/detail access or redirected/handled as unavailable.
- Reserved / adoption-in-progress pets should remain visible if desired, but their public flag/status badge should change.
- **Stripe donations are public/customer-side only** for the demo. They do not need to create admin donation records automatically.
- **Sender.com / public forms / email intake are external/manual** for the demo. Staff can manually create admin cases from incoming emails or form notifications.
- Automatic Stripe webhook ingestion, Sender.com ingestion, or email-to-case automation can be added later.

## Backend integrations in scope

Planned stack:

- Prisma
- PostgreSQL, likely Aiven
- GraphQL API layer
- Auth.js / NextAuth for staff authentication
- Cloudinary for pet images
- Stripe for public donation checkout
- Sender.com for public/contact/email workflows



## Public pet Prisma read vertical slice

The public pet read path now uses Prisma for the first backend-connected vertical slice. The public pages `/`, `/browse`, and `/pets/[id]` call `lib/public-pet-service.ts`, which reads from Aiven PostgreSQL through Prisma Client and maps `Pet` + primary `PetImage` rows back to the existing `AdminPet` display contract.

Current scope:

- public read only;
- home featured pets, browse listing, pet detail, and related pets read from Prisma;
- admin pets/cases/people still use the mock workspace and JSON-backed services;
- Cloudinary URLs seeded into `PetImage.secureUrl` are used by public `next/image` components;
- adopted, hidden, and unavailable pets stay excluded from public reads.

The Prisma Client helper lives in `lib/server/prisma.ts`. For the Aiven demo setup it uses `@prisma/adapter-pg` and an explicit SSL configuration with `rejectUnauthorized: false`, matching the seed script. For a production-grade setup, replace this with Aiven CA certificate validation.

After copying this vertical slice, run:

```bash
npm run prisma:generate
npm run dev
```

Then verify:

- `/` shows seeded pets with Cloudinary images;
- `/browse` shows only public pets;
- `/pets/<pet-id>` opens a seeded pet detail page;
- adopted / hidden / unavailable pets do not appear publicly.


### Admin pet publication UX correction

The pet detail page should not split visibility management into a detached side panel. Publication controls now live next to the main profile save actions:

- `Save changes` updates the Prisma pet record without changing its current public visibility.
- `Save and publish` saves the profile and makes the pet visible again when the status is publishable. If a pet had been hidden/unavailable during an earlier flow, this restores it to `AVAILABLE` so the user has a clear recovery path.
- `Unpublish` keeps the admin record but removes the pet from public adoption pages by setting `isPublished = false`, `publicStatus = DRAFT`, and `hiddenAt = now`.

The separate `Hide pet` UX is intentionally removed for now because it was too easy to create a hidden/draft state without an obvious restore path. Permanent delete remains a later, explicit destructive workflow.

Future destructive-data work:

- pet hard delete with related `PetImage` rows and Cloudinary assets removed by `cloudinaryPublicId`;
- person/user GDPR delete or anonymization, preserving operational/audit history where needed.




## New Case Prisma lookup slice

The `/admin/cases/new` form now loads selectable people and pets from Prisma instead of the old JSON/mock lists. This is a lookup-only slice: creating the case itself still uses the existing mock/session-backed case workflow.

Current scope:

- the person combobox reads active Prisma `Person` records;
- GDPR-anonymized people remain excluded from the selector, matching `/admin/people`;
- the pet combobox reads Prisma `Pet` records, including non-public/admin-only pets because staff may need to open cases for adopted, unpublished, or internal records;
- the selected Prisma person/pet data is passed into the existing case draft flow.

Not migrated yet:

- `ShelterCase` Prisma create;
- case detail Prisma reads;
- application/donation/volunteer structured records in Prisma;
- dashboard/task case data from Prisma.

This keeps the next migration step small: the form can now see newly created Prisma people and pets before the much larger case-write migration starts.

## People edit and GDPR anonymization slice

People profile updates now write to Prisma from `/admin/people/[id]`. The edit modal updates the `Person` row directly, including contact fields, address parts, profile type, household context, interests, and tags.

The person detail page also includes a GDPR-oriented anonymization action. This is intentionally not a hard delete. It removes personal data while preserving operational/case history:

- `name` becomes `Deleted contact`;
- email, phone, address, household, contact method, interests, and tags are cleared;
- profile type is reset to `GENERAL_CONTACT`;
- linked cases/history remain intact for audit and operational context.

Future work can add a hard delete path for person records that have no linked cases, applications, interactions, notes, volunteer hours, or activity events. For real GDPR workflows, anonymization is the safer default because it avoids breaking historical CRM records.

## People Prisma read-only slice

People now follow the same safe migration pattern as pets: seed first, then read-only Prisma views, then writes later.

Current people scope:

- `prisma/seed.ts` upserts `prisma/seed-data/shelter-data.json` people into the Prisma `Person` table;
- `/admin/people` reads `Person` records from Prisma;
- `/admin/people/[id]` reads the primary person profile from Prisma;
- related cases, interactions, notes, timeline, and related pets still come from the existing mock/admin data for context.

Already migrated after the first read-only slice:

- `/admin/people/new` Prisma create;
- `/admin/people/[id]` Prisma profile edit;
- `/admin/people/[id]` GDPR-style anonymization.

Not migrated yet:

- hard delete for people with no linked history;
- New Case create backed by Prisma `ShelterCase` records.

After copying this slice, run:

```bash
npm run db:seed
npm run dev
```

Expected seed summary should include the people count from `prisma/seed-data/shelter-data.json`.

## Prisma bootstrap status

This project now has the files needed for a safe Prisma bootstrap, but the app runtime still does not import Prisma Client. This keeps the current mock app stable while preparing the database layer.

Added bootstrap files:

- `prisma.config.ts` for Prisma v7 CLI configuration;
- `.env.example` with Aiven/PostgreSQL, Auth.js, Cloudinary, Stripe, and Sender.com placeholders;
- `prisma/seed.ts` for idempotent StaffUser, Pet, and primary PetImage seeding with optional Cloudinary upload;
- package scripts for validation, generation, migration, Studio, and seeding.

Prisma v7 note: the database URL is configured through `prisma.config.ts`; `schema.prisma` keeps only the datasource provider. The config includes a local fallback URL only so `prisma validate` / `prisma generate` can run before the real Aiven database exists. Set a real `DATABASE_URL` before running migrations.

Recommended local setup after copying these files:

```bash
npm install
cp .env.example .env
npx prisma validate
```

If using pnpm instead, run:

```bash
pnpm install
pnpm prisma validate
```

After Aiven PostgreSQL is configured and the initial migration has been applied, run `npm run prisma:generate` before `npm run db:seed`.

## The most important vertical slice

The first real backend slice should be the Pet flow because it is the only mandatory admin-public sync point.

Recommended order:

1. Prisma schema review and finalization, including auth/session models.
2. Prisma install/init and Aiven PostgreSQL connection.
3. Configure Cloudinary env values.
4. Seed existing pet JSON into `Pet` and `PetImage`, uploading local `prisma/seed-assets/pets/*` files to Cloudinary first when credentials are available.
5. Build Prisma pet repository.
6. Move public `/browse` and `/pets/[id]` to backend pet reads.
7. Move admin pets list/detail/create/edit to backend pet reads/writes.
8. Add admin Cloudinary upload/update flow for future pet image changes.
9. Add staff authentication before treating admin writes as production-like.
10. Then move admin cases/people/tasks from mock repository to Prisma.
11. Add Stripe public checkout.
12. Add Sender.com public/contact/email flows.

## Pet visibility rules

The public site should not simply show every pet row. It should use explicit public visibility rules.

Suggested public query logic:

```ts
where: {
  isPublished: true,
  publicStatus: { in: ['PUBLISHED', 'RESERVED'] },
  status: { in: ['AVAILABLE', 'NEW', 'RESERVED', 'ADOPTION_IN_PROGRESS'] },
}
```

Adopted pets can remain in the database and admin history, but should generally be hidden from public browse.

Suggested status mapping:

| Admin status | Public behavior |
| --- | --- |
| `AVAILABLE` | visible as adoptable |
| `NEW` | visible with “Just arrived” badge |
| `RESERVED` | visible with “Almost home” / reserved badge |
| `ADOPTION_IN_PROGRESS` | visible or limited, depending on product decision |
| `ADOPTED` | hidden from browse; optionally show unavailable detail state |
| `UNAVAILABLE` | hidden |
| `HIDDEN` | hidden |

## Cloudinary image model

Use a separate `PetImage` model rather than a single `image` string on `Pet`.

Reasons:

- multiple images per animal later;
- primary image support;
- sort order;
- alt text;
- Cloudinary `publicId` for deletion/replacement;
- ability to store dimensions, format, and optimized URLs.

Minimum fields:

- `cloudinaryPublicId`
- `secureUrl`
- `thumbnailUrl`
- `alt`
- `sortOrder`
- `isPrimary`

For the first implementation, the public pet card can use the primary image. If no primary image exists, fall back to the first image by `sortOrder`.


### Cloudinary seed behavior

The seed script supports two modes:

1. If `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are present, every pet image path from `prisma/seed-data/pets.json` is resolved against `prisma/seed-assets/pets/*`, uploaded to Cloudinary, and then saved into `PetImage.secureUrl`, `PetImage.thumbnailUrl`, and `PetImage.cloudinaryPublicId`.
2. If Cloudinary credentials are missing, the seed falls back to the existing local public image path so local bootstrapping still works.

Expected local path mapping:

```txt
dog-1.png -> prisma/seed-assets/pets/dog-1.png
```

Expected Cloudinary public ID shape:

```txt
furever-home/pets/<pet-id>/<image-file-name>
```

This keeps the seed idempotent: repeated runs update the same `Pet`, `StaffUser`, and primary `PetImage` rows instead of creating duplicates.

## Staff authentication and audit actor plan

Authentication is required for the admin area because audit history must show the real staff member who performed each mutation. The current mock actor layer is a useful temporary replacement for this future session-based actor.

Recommended auth approach:

- Auth.js / NextAuth with Prisma-backed session tables;
- credentials login for the demo (`email + password`);
- optional OAuth or magic link later;
- admin-only route protection for every `/admin/*` route;
- role-based access can start simple and become stricter later.

Recommended staff roles:

- `ADMIN`
- `CASE_MANAGER`
- `VOLUNTEER_COORDINATOR`
- `VIEWER`

The schema draft includes `StaffUser`, `Account`, `Session`, and `VerificationToken` models. If the standard Auth.js Prisma adapter is used without customization, confirm model naming before implementation. The lowest-friction Auth.js setup usually expects a `User` model; this draft keeps the domain name `StaffUser` to make audit ownership explicit. During implementation, either map Auth.js to this model intentionally or rename the auth-facing model to `User` and keep staff-specific fields on it.

Migration path from mock actor to real auth:

```txt
getCurrentMockStaff()
-> getCurrentStaffFromSession()
-> command layer receives actor from session
-> Prisma writes store actor/staff IDs
```

The command layer should remain the boundary for audit attribution. Server actions and GraphQL mutations should not invent actor names manually; they should resolve the current staff session once and pass the staff actor into the write command.

Audit actor rules:

- every admin mutation must have a staff actor when auth is enabled;
- `actorId` should reference `StaffUser.id` where possible;
- `actorName` and `actorRole` can be denormalized snapshots for stable historical display;
- system-generated events should use `actorType = SYSTEM` and no staff ID;
- public/external actions should not pretend to be staff actions.

## Stripe scope

For the demo, Stripe should be treated as a public checkout integration.

In scope:

- public donate page;
- create checkout session;
- success/cancel pages;
- no required admin CRM write.

Out of scope for demo:

- Stripe webhook processing;
- donation history in admin;
- automatic `DonationInquiry` creation;
- donor matching by email;
- reconciliation dashboard.

Future option:

```txt
Stripe webhook -> DonationRecord -> optional Person match -> optional ActivityEvent / Case
```

Do **not** add a mandatory `DonationRecord` model in the first Prisma slice unless donation history becomes part of the demo.

## Sender.com / public form scope

For the demo, Sender.com and public form/email flows can remain external/manual.

In scope:

- public forms or CTAs can send email / trigger Sender.com flows;
- admin staff can manually create cases from those messages.

Out of scope for demo:

- automatic form-to-case ingestion;
- Sender.com webhook handling;
- email parser;
- deduplication queue;
- automatic person matching.

Future option:

```txt
Sender.com/form/email event -> IntakeEvent -> review queue -> Case / Person / Interaction
```

No `IntakeEvent` model is required in the first backend slice.

## GraphQL boundary

GraphQL should expose separate public and admin surfaces.

Suggested public queries:

```graphql
type Query {
  publicPets(filter: PublicPetFilterInput, pagination: PaginationInput): PublicPetConnection!
  publicPet(slug: String!): PublicPet
}
```

Suggested admin queries/mutations for the first pet slice. These must require an authenticated staff session:

```graphql
type Query {
  adminPets(filter: AdminPetFilterInput): [AdminPet!]!
  adminPet(id: ID!): AdminPet
}

type Mutation {
  createPet(input: CreatePetInput!): AdminPet!
  updatePet(id: ID!, input: UpdatePetInput!): AdminPet!
  updatePetStatus(id: ID!, status: PetStatus!): AdminPet!
  addPetImage(petId: ID!, input: PetImageInput!): PetImage!
  setPrimaryPetImage(petId: ID!, imageId: ID!): PetImage!
  removePetImage(petId: ID!, imageId: ID!): Boolean!
}
```

The existing command layer can remain useful behind GraphQL mutations.

## Admin CRM models

Admin CRM should keep these models:

- `StaffUser`
- `Account` / `Session` / `VerificationToken` for staff auth
- `Person`
- `ShelterCase`
- `CaseInteraction`
- `CaseNote`
- `CaseEvent`
- `AdoptionApplication`
- `VirtualAdoption`
- `DonationInquiry`
- `VolunteerApplication`
- `VolunteerHours`
- `ActivityEvent`
- `PetStatusEvent`

`Task` is intentionally not a table in the first draft. The current task view can be computed from:

- `ShelterCase.nextFollowUpAt`
- `ShelterCase.nextFollowUpNote`
- `ShelterCase.assignedStaffId`
- `ShelterCase.priority`
- `ShelterCase.status`

A dedicated `Task` model is only needed later if the product needs multiple independent tasks per case, task completion history, recurring tasks, or tasks unrelated to cases.

## Migration notes from current mock data

Current data uses lower-case string statuses and prefixed string IDs. The schema draft keeps `String @id` rather than UUIDs to make migration easier.

Mapping examples:

| Current value | Prisma enum |
| --- | --- |
| `available` | `AVAILABLE` |
| `new` | `NEW` |
| `reserved` | `RESERVED` |
| `adopted` | `ADOPTED` |
| `waiting_on_contact` | `WAITING_ON_CONTACT` |
| `donation_support` | `DONATION_SUPPORT` |

Legacy values such as `waiting_reply`, `in_review`, `adoption_interest`, `question`, `donation`, and `volunteer` should be mapped during seed/migration rather than kept forever in the production enum set.

## First implementation recommendation

Do not migrate the whole CRM in one step.

Start with this vertical slice:

```txt
Pet + PetImage + Cloudinary + public browse/detail + admin pet create/edit/status
```

Before treating admin writes as production-like, add staff authentication so pet create/edit/status changes can be attributed to a real logged-in staff member. After that works, move cases/people/tasks to Prisma.


## Prisma v7 seed runtime note

Prisma Client v7 requires a database driver adapter at runtime. The seed script uses `@prisma/adapter-pg` with the project `DATABASE_URL` from `.env`. Required packages: `@prisma/adapter-pg` and `pg`.

## Admin Pets read-only Prisma slice

The admin pet list and admin pet detail pages now read pet profile data from Prisma/Aiven as the first admin-side pet vertical slice. This keeps the public and admin pet views aligned on the same seeded `Pet` and `PetImage` rows while leaving admin writes on the existing mock/session flow for now.

Current scope:

- `/admin/pets` reads `Pet` and `PetImage` through Prisma;
- `/admin/pets/[id]` reads the selected `Pet` and `PetImage` through Prisma;
- related cases and pet activity are still derived from the existing mock admin data;
- create/edit pet actions are intentionally not migrated to Prisma yet.

Next admin pet steps:

1. migrate `/admin/pets/new` to create Prisma `Pet` / `PetImage` rows;
2. migrate `/admin/pets/[id]` edit actions to update Prisma rows;
3. wire adoption completion to update `Pet.status` in Prisma;
4. remove the mock pet write layer after the Prisma write paths are stable.


## Admin pet create Prisma write status

The admin new pet flow is now wired to Prisma for the first write slice. `/admin/pets/new` reads existing pets from Prisma for form options and creates new `Pet` + primary `PetImage` rows in Aiven PostgreSQL.

Current scope:

- creates a stable `pet-XXXX` id from existing Prisma pet ids;
- creates a `publicSlug` from the pet name and id;
- maps admin status strings to the Prisma `PetStatus` enum;
- maps publication state to `PetPublicStatus`;
- creates one primary `PetImage`;
- accepts either an existing Cloudinary URL or a local `/images/pets/...` path;
- revalidates admin and public pet routes after creation.

Still intentionally deferred:

- admin image upload UI;
- multi-image admin management;
- admin pet edit Prisma write;
- adoption workflow pet status DB updates.



### Admin pet edit UX adjustment

The admin pet edit form no longer exposes `hidden` or `unavailable` in the adoption status dropdown. Public visibility is controlled through explicit actions near the save controls: `Save changes`, `Save and publish`, and `Unpublish`. Inline success copy is intentionally removed because this flow should later use a toast/notification system.

## Complete adoption Prisma pet status update

The adoption workflow remains mock/session-backed for cases and applications, but the `Complete adoption` action now also updates the real Prisma `Pet` row. This is the first CRM action that changes the shared pet source of truth.

When staff completes an adoption case:

- `Pet.status` is set to `ADOPTED`;
- `Pet.publicStatus` is set to `ADOPTED`;
- `Pet.isPublished` is set to `false`;
- `Pet.hiddenAt` is set to the completion timestamp;
- admin pet routes and public pet routes are revalidated.

Expected behavior:

- the pet remains visible in admin pet list/detail as adopted;
- the pet is removed from `/browse`;
- the public `/pets/[id]` route no longer renders as an adoptable public profile.

The case, adoption application, and timeline data still use the existing mock workflow layer. Those should be migrated separately when the People/Cases Prisma slices are introduced.

## Admin pet image upload slice

The admin pet create and edit screens now support direct Cloudinary image upload for the primary pet image. The upload endpoint is server-only and keeps Cloudinary credentials out of the browser.

Current flow:

- `POST /api/admin/pet-images` accepts one JPG, PNG, or WebP file up to 8 MB;
- the route uploads the file to Cloudinary under `furever-home/pets/...`;
- the client receives `secureUrl`, `thumbnailUrl`, and `cloudinaryPublicId`;
- `/admin/pets/new` saves those values into `Pet` and primary `PetImage`;
- `/admin/pets/[id]` can replace the primary image and then save it through the existing Prisma update action.

The manual image URL field remains as a fallback for existing Cloudinary URLs or local `/images/pets/...` paths. Multi-image gallery management and Cloudinary asset deletion are still intentionally deferred.


## Admin pet Cloudinary image upload status

Uploaded admin pet images are delivered through square Cloudinary transformation URLs (`crop: fill`, `gravity: auto`) so public/admin cards receive consistent square images. The UI still supports pasting an existing Cloudinary URL or `/images/pets/...` local path as a manual fallback.


### Admin pet image upload UX update

The admin pet image upload flow now uses the canonical `/api/admin/pet-images` route and opens a client-side square crop step before uploading to Cloudinary. Staff can drag and zoom the selected image, then upload the 1200x1200 cropped result. The existing URL/local path text field remains only as a manual fallback.

The old `/app/admin/api/...` route location should not be used for this upload flow; `/api/admin/pet-images` is the runtime endpoint.

- Admin pet image cropper now renders the final 1200 x 1200 JPG client-side before Cloudinary upload.

### Admin image cropper package switch

The admin pet image cropper now uses `react-easy-crop` instead of custom pointer/canvas positioning. The package owns the drag/zoom crop UI and returns the selected crop area in pixels. The app still exports the selected square crop to a 1200x1200 JPEG client-side before uploading it to the existing `/api/admin/pet-images` Cloudinary route.


### Prisma pet TypeScript cleanup

The pet Prisma write/read slices no longer import generated enum members directly from `@prisma/client`. Prisma 7 generation can differ by client configuration, so the app now uses a small local server-side enum contract in `lib/server/prisma-pet-enums.ts` for the pet status values sent to Prisma.

This keeps the existing Prisma schema enum values unchanged while removing editor errors around `PetStatus` / `PetPublicStatus` named exports. The domain `PetImage` type also includes `thumbnailUrl` so admin edit/create forms can read and save Cloudinary thumbnail URLs without falling back to `any`.

## Admin pet permanent delete

The admin pet detail page now includes a guarded danger-zone delete action. The user must type the pet name before deleting. The action deletes the Prisma `Pet` row, relies on the `PetImage` cascade for image rows, and attempts to delete managed Cloudinary image assets by `cloudinaryPublicId`.

Permanent delete is blocked when Prisma already has related case/application/activity/status records for the pet. In those cases, staff should use Unpublish until related records can be handled deliberately. Person/user deletion should remain a separate GDPR-style anonymize/delete workflow because case history and audit requirements are different from pet inventory cleanup.


### Admin new pet draft preservation

The `/admin/pets/new` form now stores an in-browser `sessionStorage` draft while the user is editing. This protects entered form values during image crop/upload UI changes or route-level remounts. The draft is cleared only after the pet is successfully created.


## People Prisma create slice

The `/admin/people/new` flow now writes new contacts directly to Prisma instead of the mock workspace. The read-only People Prisma slice remains the source for `/admin/people` and `/admin/people/[id]`, so a newly created person appears immediately in both places.

Current behavior:

- the action generates the next `person-0000` style ID from existing Prisma `Person` rows;
- contact method values are mapped to the Prisma `ContactChannel` enum values;
- person type / tags are mapped to `PersonProfileType`;
- the single textarea address is stored as structured address columns when comma-separated parts are available;
- `/admin/people`, `/admin/people/[id]`, `/admin/cases/new`, and `/admin/dashboard` are revalidated after creation.

Still deferred:

- `/admin/people/[id]` Prisma edit writes;
- person GDPR anonymize/delete;
- New Case person/pet selectors backed by Prisma;
- New Case create backed by Prisma `ShelterCase` records;
- full cases/applications migration.

### People list and anonymized records

GDPR-anonymized `Person` records are intentionally excluded from `/admin/people`. They remain addressable by direct detail URL and may still be linked from historical case/audit context, but they are no longer useful as active contact records in the main People list.



## New Case Prisma write slice

The `/admin/cases/new` form now creates the primary case record in Prisma while preserving the current mock/session case detail experience until case read pages are migrated.

Current write path:

- resolves an existing Prisma `Person`, or creates a new `Person` when the form is filled manually;
- validates the selected Prisma `Pet`, when present;
- creates a `ShelterCase`;
- creates the initial `CaseInteraction`;
- creates a `CaseEvent`;
- creates `ActivityEvent` records for the case and linked pet;
- creates a basic structured record for adoption, donation, virtual adoption, or volunteer cases when applicable.

The case list/detail/dashboard still read primarily from the existing mock/session services. The create action mirrors the new Prisma case into the in-memory workspace so the redirect to `/admin/cases/[id]` keeps working during this transition. The next migration step should move `/admin/cases` and `/admin/cases/[id]` reads to Prisma.

## Cases list Prisma read slice

The `/admin/cases` list now reads Prisma/Aiven `ShelterCase` records first, then keeps a temporary legacy mock fallback for old demo cases that have not been seeded into Prisma yet. This avoids an empty/regressed case list while the cases migration is still in progress.

The Prisma mapper includes the related `Person`, optional `Pet`, assigned staff, structured case records, interactions, notes, case events, and activity events so the existing list filters, follow-up sorting, priority stats, and contact labels can keep using the current `AdminPetCase` UI contract.

This is intentionally a read-only list slice. Case detail, case timeline, notes, interactions, management modals, and dashboard/task aggregations still need their own Prisma read/write migration steps. The legacy fallback should be removed after the case seed/detail/action slices are migrated.


## Legacy case seed and seed cleanup

The seed script now moves the legacy demo case dataset from `prisma/seed-data/shelter-data.json` into Prisma. This covers the core CRM runtime tables: `ShelterEvent`, `ShelterCase`, `CaseInteraction`, `CaseNote`, `CaseEvent`, `ActivityEvent`, `AdoptionApplication`, `VirtualAdoption`, `DonationInquiry`, and `VolunteerApplication`.

The seed remains idempotent through `upsert` calls, so it can be run repeatedly while the migration continues. Legacy case numbers are protected from collisions with manually created Prisma cases: if a demo `caseNumber` is already used by another case, the seed stores the legacy row with a `LEGACY-` prefix instead of failing on the unique constraint.

Pet image seeding now reuses existing Cloudinary-backed `PetImage` rows instead of uploading every image on every seed run. Missing images are still uploaded when Cloudinary env variables are configured, and local-path fallback remains available when Cloudinary is not configured or a source file cannot be found.

The JSON files are still seed fixtures for now. They should no longer be treated as the long-term runtime source of truth. Once case detail, case actions, dashboard, and tasks read/write from Prisma, the remaining runtime JSON imports can be removed and the fixture files can be moved under a dedicated seed-data directory.

### Case detail Prisma read status

`/admin/cases/[id]` now reads Prisma `ShelterCase` records first, including linked `Person`, `Pet`, `CaseInteraction`, `CaseNote`, `CaseEvent`, `ActivityEvent`, and structured case records (`AdoptionApplication`, `DonationInquiry`, `VirtualAdoption`, `VolunteerApplication`).

The legacy mock detail reader is kept only as a temporary fallback for any case that has not yet been seeded or migrated. The next case milestone is to move the case detail actions/modals to Prisma writes so notes, interactions, status changes, management updates, and structured record updates no longer depend on the mock workspace.


## Case action Prisma write status

Case detail read is now backed by Prisma for seeded and newly created cases, and the primary case detail mutations have been moved to Prisma as well:

- internal notes create `CaseNote`, `CaseEvent`, and `ActivityEvent` rows;
- interaction logs create `CaseInteraction`, `CaseEvent`, and `ActivityEvent` rows;
- case status and management updates write to `ShelterCase` and append timeline/activity rows;
- structured case records update `AdoptionApplication`, `DonationInquiry`, `VirtualAdoption`, and `VolunteerApplication` rows;
- volunteer hours create `VolunteerHours` rows;
- adoption workflow actions update `ShelterCase`, `AdoptionApplication`, and, when needed, the linked `Pet` status/public visibility.

A small legacy fallback remains for records that may still be resolved only through the transitional mock layer. The next cleanup step is to remove that fallback after the dashboard/tasks and all case reads are Prisma-only.

The repeated red destructive/anonymization blocks are now shared through `components/admin/DangerZone.tsx` so the pet hard-delete and person GDPR anonymization UI stay visually consistent.
## Dashboard and tasks Prisma read slice

The admin dashboard and tasks page now use the Prisma-backed pet/case spine for their runtime dataset:

- `getDashboardDataset()` is asynchronous and reads pets from Prisma via `getPrismaAdminPets()`;
- case and follow-up inputs come from `getAdminCasesFromPrisma()`;
- `/admin/dashboard` and `/admin/tasks` await the Prisma-backed dataset before rendering.

This does not remove every legacy dashboard fixture yet. Historical summaries, some activity-style aggregates, and seed-derived demo context still keep transitional fallback data until the remaining dashboard/task calculations are migrated to pure Prisma queries.

Next cleanup target: replace remaining runtime dashboard fixture reads with Prisma-derived aggregates, then remove the case fallback once all legacy cases have been verified in the database.



## Dashboard cleanup note

The dashboard now treats Prisma data as the primary operational source for its current pet population and case-derived monthly activity. Historical mock monthly pet snapshots are no longer merged into the current dashboard dataset because they inflated current shelter counts. The month selector always includes the current month, even if the selected month has no case activity yet, so the user can switch into July/current month and still see the current pet population.

The remaining dashboard fixture/fallback data should be removed in later cleanup passes after donation, volunteer, and activity reporting are fully Prisma-backed.

## Dashboard historical data repair

The dashboard must distinguish between transactional runtime data and historical analytics data. Prisma is the runtime source for current pets, people, cases, and write actions, but the existing dashboard history contains precomputed operational records that do not map one-to-one to the current transactional tables yet.

The dashboard dataset now uses:

- legacy `animalIntakes`, `adoptions`, `applications`, `donations`, `volunteerHours`, `activityEvents`, `dailySummaries`, `monthlySummaries`, `speciesMonthlySummaries`, `petStatusEvents`, and `monthlyPetSnapshots` as the historical analytics baseline;
- Prisma pets for the current-month pet population and live pet edits;
- Prisma cases for follow-ups and new case activity that does not exist in the legacy fixture set.

This fixes the incorrect historical month behavior where every month displayed the current Prisma pet count. For past months, the dashboard uses the historical `monthlyPetSnapshots` data. For the current month, it overlays the current Prisma pet inventory. Operational cards such as applications, volunteer hours, donations, and summary trends use the historical event/summary records plus any live Prisma-created records that are not part of the legacy fixture set.

The long-term goal is still to move these analytics records into real Prisma tables or derive them from complete transactional history. Until then, the JSON dashboard arrays are treated as seed/analytics fixtures, not current entity source of truth.


### Dashboard historical analytics correction

The dashboard now treats historical reporting as analytics data rather than a direct view of today's transactional `Pet` table. Past months use the seeded historical dashboard records for monthly snapshots, daily summaries, applications, donations, volunteer hours, and activity trends. Current/live Prisma records are layered on top only where they represent new runtime activity.

Important dashboard rules:

- A selected historical month must use that month's `monthlyPetSnapshots`, not today's pet inventory.
- Application pipeline counts must be scoped to the selected period and filters, not all-time unresolved applications.
- Partial historical months, such as the first seeded month, should chart only the dates that actually have seeded records rather than rendering a mostly empty full calendar month.
- Pet population charts use the selected month's matching pet records; the separate `in shelter` count still respects `inShelter` / adopted status.


## Dashboard analytics database cutover

The dashboard historical fixture data is now seeded into Prisma through the generic `DashboardAnalyticsRecord` table. This separates dashboard reporting data from runtime JSON imports:

- `prisma/seed-data/shelter-data.json` remains a seed fixture input.
- Runtime dashboard reads should use Prisma analytics records, not direct JSON imports.
- Historical pet reporting intentionally distinguishes monthly pet records from month-end shelter population.
- If a month has a month-end `inShelter=true` snapshot, species/age/status population charts use that month-end shelter population.
- If a partial historical month has no month-end shelter population, species/age/status charts use the monthly pet records for that month and the `in shelter` card remains separate.

The seed now replaces dashboard analytics collections before inserting the current fixture version. After copying this change, run the dashboard analytics migration and then `npm run db:seed` so the latest fixture data is uploaded to Aiven.

## Historical pet seed model

The Prisma `Pet` table now contains both current and historical pets:

- `prisma/seed-data/pets.json` defines the 30 current inventory pets and their seed-only image filenames.
- `prisma/seed-data/shelter-data.json.animalIntakes` is used to derive historical pet rows for every older pet ID referenced by cases, applications, adoptions, activity, and dashboard analytics.
- Historical pets are seeded as `ADOPTED`, `publicStatus=ADOPTED`, `isPublished=false`, and do not receive `PetImage` rows.
- Admin/public pet list queries only show published current pets, but case detail and structured records can still resolve old pet foreign keys.

This keeps the database relationally consistent without forcing old adopted animals into the public/current adoption inventory.

## Historical pet data and person related-pet repair

Historical pets now use names and descriptions from the repaired dashboard fixture instead of generated archive-style placeholder copy. The seed builds historical `Pet` records from `animalIntakes`, keeps them unpublished, and preserves their case/application relationships without displaying archive/demo language in the UI.

Person detail pages now resolve cases, related pets, interactions, notes, and timelines through the Prisma-backed case service. This means a person such as `person-0024` will show historical pets linked through their Prisma cases, including records like `pet-0175`, even when the animal is no longer part of the current public adoption inventory.

## Tasks page layout fix

The main tasks table can be taller than the viewport when seeded follow-up data exists. It should not be wrapped in the default `MotionReveal`, because that component waits until a percentage of the element is visible before revealing it. For a very tall table that threshold may never be reached, leaving an invisible but layout-occupying column. The tasks table now renders immediately inside a fixed-height scroll container with a sticky table header, while the right bucket summary remains sticky on desktop.

## Tasks page list height tuning

The main `/admin/tasks` table uses a local scroll container again. Its height is intentionally close to the visible task-bucket column so the page reads as a balanced two-column work queue rather than a tiny table beside a tall bucket sidebar or an endlessly long document. The large table is not wrapped in `MotionReveal`, because viewport-triggered reveal animations can keep very tall tables invisible.

## Tasks two-column height behavior

The tasks page should let the right-hand bucket panel keep its natural full height. The main task list column stretches to that grid row height and scrolls internally. Do not cap or scroll the bucket panel; it is the visual height reference for the row.

## Tasks page height reference fix

The task page layout now treats the right-hand bucket card as the height reference. The bucket panel keeps its natural content height: no artificial max-height, no overflow clipping, and no extra empty area below the last bucket. On xl screens, the left task-list card measures that right panel and uses the same height, with the table body scrolling internally when the task list is longer than the bucket card. This keeps the right bucket stack natural while preventing the left task list from stretching the whole page.

## Cases Prisma-only cutover

Case detail routes now use the Prisma case service for the detail payload, interactions, notes, and timeline. The Prisma case service no longer merges transitional legacy/mock cases into `getAdminCasesFromPrisma`, and its case-detail helpers return empty/not-found results instead of falling back to JSON/mock records.

Case detail server actions now write directly to Prisma for notes, interactions, status changes, management updates, structured adoption/donation/virtual adoption/volunteer updates, volunteer hours, pet status changes, case events, activity events, and adoption workflow actions. Legacy mock-workspace fallbacks were removed from `app/admin/cases/[id]/actions.ts`.

`current-staff.ts` no longer imports the JSON-backed mock repository. The remaining synchronous `getCurrentMockStaff`/`getMockStaffById` exports are compatibility shims for modules that will be removed in later cutover rounds; new case-detail writes resolve staff from Prisma.

## New case Prisma write cutover

The `/admin/cases/new` server action now writes new cases directly to Prisma instead of creating mock workspace records. It creates or resolves the linked person, validates the related pet, inserts the `ShelterCase`, first `CaseInteraction`, `CaseEvent`, `ActivityEvent`, optional pet activity event, and the structured case-specific record such as `AdoptionApplication`, `DonationInquiry`, `VolunteerApplication`, or `VirtualAdoption` in the database.

The client-facing preview still uses `buildIncomingCasePreview`, but the final `createCaseAction` result is marked as `persisted: "database"`. The old `createMockCaseAction` export remains only as a compatibility alias and now points to the Prisma-backed action.

## Pet and person admin read cleanup

The admin pet detail page now reads its related cases, status events, and activity timeline from Prisma-backed service functions. The page no longer calls the legacy synchronous `getAdminPetCases` or `getAdminPetActivity` helpers.

`lib/admin/pet-service.ts` is now Prisma-first for admin pet list/detail, related case counts, pet detail cases, pet status events, and pet activity. Legacy synchronous pet helper exports remain only as empty compatibility shims while older unused modules are removed.

`lib/admin/person-service.ts` no longer imports the mock repository or mock workspace. Admin people list/detail and their stats, interactions, notes, timeline, and related pets are Prisma-backed. Legacy synchronous person helper exports remain only as empty compatibility shims while older unused modules are removed.

`lib/admin/profile-write-commands.ts` no longer writes through the mock workspace. It is retained as a compatibility module and writes through Prisma if it is called by older code.

## Dashboard and case service fixture cleanup

The case service and dashboard service now avoid runtime reads from local fixture repositories. Runtime case reads use the async Prisma-backed APIs, and the remaining synchronous case-service exports are compatibility shims that intentionally return empty data instead of falling back to local fixture or in-memory sources.

The dashboard dataset is now assembled from Prisma-backed admin pets, Prisma-backed cases, DashboardAnalyticsRecord history, and live Prisma records for adoption applications, donation inquiries, virtual adoptions, volunteer hours, activity events, and pet status events. Local fixture repositories remain only as legacy files until the final removal pass, not as dashboard or case-service runtime dependencies.

## Runtime JSON/mock cleanup

The legacy runtime mock layer has been removed from `lib/admin`:

- `lib/admin/mock-repository.ts`
- `lib/admin/mock-workspace.ts`
- `lib/admin/case-write-commands.ts`
- `lib/admin/create-write-commands.ts`

The application runtime should not import `prisma/seed-data/shelter-data.json` or `prisma/seed-data/pets.json`. Those files remain seed inputs only through `prisma/seed.ts`.

Use this check before deploy:

```bash
grep -R "mock-repository\|mock-workspace\|prisma/seed-data/shelter-data.json\|prisma/seed-data/pets.json\|case-write-commands\|create-write-commands" app lib components
```

Expected result: no matches. Seed references under `prisma/seed.ts` are allowed.


## Prisma Accelerate runtime and connection management

The deployed Vercel application uses Prisma Accelerate as a managed serverless connection pool in front of the existing Aiven PostgreSQL database.

Connection responsibilities are intentionally split:

- `DATABASE_URL` contains the generated `prisma://...` Accelerate connection string and is used by application runtime queries.
- `DIRECT_DATABASE_URL` contains the direct Aiven `postgresql://...` connection string and is used by Prisma CLI commands, migrations, introspection, and controlled seed tooling.
- `prisma.config.ts` must read `DIRECT_DATABASE_URL`; Prisma Migrate cannot use the Accelerate runtime URL.
- `@prisma/extension-accelerate` extends the runtime Prisma Client so queries are routed through Accelerate.
- The project currently uses Accelerate for connection pooling, not Prisma query caching. Application read caching is handled separately through Next.js server-side cache tags and mutation-driven invalidation.

Accelerate was introduced after direct Vercel-to-Aiven connections exhausted the limited connection capacity of the Aiven plan. The Accelerate pool size should remain conservative, and large analytics queries must stay paginated or split by collection to remain below Accelerate response-size and worker limits.

Local and deployment environment shape:

```dotenv
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgresql://...aiven...?...sslmode=require"
```

Use the Prisma CLI supported by the installed project version:

```bash
npx prisma generate
npm run prisma:migrate:deploy
```

Do not add unsupported CLI flags solely from generic documentation examples; confirm them against `npx prisma generate --help` for the installed Prisma version.

## ESLint flat config stabilization

The project uses ESLint 9 flat config with Next's core-web-vitals and TypeScript presets. The `react-hooks/set-state-in-effect` rule is disabled because several client components intentionally hydrate local UI state from browser-only APIs such as `sessionStorage` or `window.location` after mount. The `@typescript-eslint/no-explicit-any` rule is also disabled for seed/raw dashboard boundary types where JSON-shaped data is narrowed before it reaches domain-facing services.


## Lint and type strictness cleanup

The runtime app should pass `npx tsc --noEmit`, `npm run lint`, and `npm run build` without warnings. The ESLint config keeps Next.js flat config enabled while avoiding explicit `any` at app boundaries. Raw dashboard and seed records are represented with `unknown` or Prisma JSON types and narrowed before use.

## TypeScript no-warning cleanup

Dashboard records are intentionally typed as primitive dashboard values instead of broad `unknown` so UI filtering, keys, labels, and chart inputs stay type-safe without `any`. Shared label helpers accept `unknown` at the boundary and narrow to primitive values before formatting.

## Type boundary cleanup for dashboard and live Prisma rows

Dashboard client data now uses `AdminDashboardDataset` from the domain layer so the public prop contract stays identical between `dashboard-service` and `DashboardClient`. Live Prisma dashboard rows convert nullable relation ids to `undefined` before entering `DashboardRecord`, keeping the record type primitive-only and avoiding implicit-any/unknown callback fallout in UI code. Prisma model rows are imported as concrete generated model types instead of empty `GetPayload<{}>` aliases.
