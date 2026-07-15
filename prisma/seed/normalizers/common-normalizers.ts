import path from "node:path";

export const normalizeValue = (value: string | null | undefined) => {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_") ?? ""
  );
};

export const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getFileNameWithoutExtension = (value: string) => {
  return path.basename(value, path.extname(value));
};

export const toDate = (value: string | undefined) => {
  return value ? new Date(value) : undefined;
};

export const toNullableDate = (value: string | null | undefined) => {
  return value ? new Date(value) : null;
};

export const toRequiredDate = (value: string | null | undefined) => {
  return value ? new Date(value) : new Date();
};

export const toDecimalString = (value: number | null | undefined) => {
  return typeof value === "number" ? value.toFixed(2) : null;
};
