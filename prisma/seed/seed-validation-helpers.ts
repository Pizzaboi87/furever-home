export const normalizeSeedValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
};

export const collectDuplicateIds = <T extends { id: string }>(records: T[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const record of records) {
    if (seen.has(record.id)) {
      duplicates.add(record.id);
    }

    seen.add(record.id);
  }

  return [...duplicates];
};

export const assertNoDuplicateIds = <T extends { id: string }>(
  label: string,
  records: T[],
) => {
  const duplicates = collectDuplicateIds(records);

  if (duplicates.length > 0) {
    throw new Error(
      `Seed validation failed: duplicate ${label} IDs: ${duplicates.join(", ")}`,
    );
  }
};

export const assertReferencesExist = (
  label: string,
  references: Array<{ recordId: string; referencedId: string }>,
  validIds: Set<string>,
) => {
  const invalidReferences = references.filter(
    ({ referencedId }) => !validIds.has(referencedId),
  );

  if (invalidReferences.length > 0) {
    const details = invalidReferences
      .slice(0, 10)
      .map(({ recordId, referencedId }) => `${recordId} -> ${referencedId}`)
      .join(", ");

    throw new Error(
      `Seed validation failed: invalid ${label} references: ${details}`,
    );
  }
};
