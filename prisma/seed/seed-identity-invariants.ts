import type { AdminDashboardFile } from "./seed-types";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const assertUniqueEmails = ({
  label,
  records,
}: {
  label: string;
  records: readonly { id: string; email?: string | null }[];
}) => {
  const idsByEmail = new Map<string, string[]>();

  records.forEach(({ id, email }) => {
    if (!email?.trim()) {
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const ids = idsByEmail.get(normalizedEmail) ?? [];
    ids.push(id);
    idsByEmail.set(normalizedEmail, ids);
  });

  const duplicates = [...idsByEmail.entries()].filter(([, ids]) => ids.length > 1);

  if (duplicates.length > 0) {
    throw new Error(
      `Seed validation failed: duplicate ${label} email addresses: ${duplicates
        .slice(0, 10)
        .map(([email, ids]) => `${email} (${ids.join(", ")})`)
        .join(", ")}.`,
    );
  }
};

const assertNoCrossIdentityEmailCollisions = ({
  staff,
  people,
}: {
  staff: readonly { id: string; email?: string | null }[];
  people: readonly { id: string; email?: string | null }[];
}) => {
  const staffByEmail = new Map(
    staff.flatMap(({ id, email }) =>
      email?.trim() ? [[normalizeEmail(email), id] as const] : [],
    ),
  );

  const collisions = people
    .flatMap(({ id, email }) =>
      email?.trim()
        ? [{ personId: id, email: normalizeEmail(email) }]
        : [],
    )
    .filter(({ email }) => staffByEmail.has(email));

  if (collisions.length > 0) {
    throw new Error(
      `Seed validation failed: staff and person identities share email addresses: ${collisions
        .slice(0, 10)
        .map(({ personId, email }) =>
          `${email} (staff ${staffByEmail.get(email)}, person ${personId})`,
        )
        .join(", ")}.`,
    );
  }
};

const validateStaffActorMetadata = ({
  label,
  records,
  staffById,
}: {
  label: string;
  records: readonly {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    actorRole?: string | null;
  }[];
  staffById: ReadonlyMap<string, { name: string; role: string }>;
}) => {
  const mismatches = records.flatMap(({ id, actorId, actorName, actorRole }) => {
    if (!actorId) {
      return [];
    }

    const staffMember = staffById.get(actorId);
    if (!staffMember) {
      return [];
    }

    const nameMismatch = Boolean(actorName?.trim()) && actorName !== staffMember.name;
    const roleMismatch =
      Boolean(actorRole?.trim()) &&
      actorRole?.trim().toLowerCase() !== staffMember.role.trim().toLowerCase();

    return nameMismatch || roleMismatch
      ? [`${id} -> ${actorId}`]
      : [];
  });

  if (mismatches.length > 0) {
    throw new Error(
      `Seed validation failed: ${label} actor metadata does not match staff records: ${mismatches
        .slice(0, 10)
        .join(", ")}.`,
    );
  }
};

export const validateIdentityInvariants = (
  adminDashboardFile: AdminDashboardFile,
) => {
  const staff = adminDashboardFile.staff ?? [];
  const people = adminDashboardFile.people ?? [];
  const cases = adminDashboardFile.cases ?? [];
  const caseEvents = adminDashboardFile.caseEvents ?? [];
  const activityEvents = adminDashboardFile.activityEvents ?? [];

  assertUniqueEmails({ label: "staff", records: staff });
  assertUniqueEmails({ label: "person", records: people });
  assertNoCrossIdentityEmailCollisions({ staff, people });

  const staffById = new Map(
    staff.map(({ id, name, role }) => [id, { name, role }]),
  );

  validateStaffActorMetadata({
    label: "case event",
    records: caseEvents,
    staffById,
  });
  validateStaffActorMetadata({
    label: "activity event",
    records: activityEvents,
    staffById,
  });

  const inactiveStaffIds = new Set(
    staff.filter(({ active }) => active === false).map(({ id }) => id),
  );

  const casesAssignedToInactiveStaff = cases.filter(
    ({ assignedStaffId }) =>
      assignedStaffId !== null &&
      assignedStaffId !== undefined &&
      inactiveStaffIds.has(assignedStaffId),
  );

  if (casesAssignedToInactiveStaff.length > 0) {
    throw new Error(
      `Seed validation failed: cases are assigned to inactive staff: ${casesAssignedToInactiveStaff
        .slice(0, 10)
        .map(({ id, assignedStaffId }) => `${id} -> ${assignedStaffId}`)
        .join(", ")}.`,
    );
  }
};
