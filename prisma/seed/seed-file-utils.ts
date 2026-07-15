import fs from "node:fs";
import type { Prisma } from "@prisma/client";
import type { RawDashboardRecord } from "./seed-types";

export const readJsonFile = (filePath: string): unknown => {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
};

export const toPrismaJsonObject = (
  record: RawDashboardRecord,
): Prisma.InputJsonObject => {
  const jsonEntries = Object.entries(record).filter(
    (entry): entry is [string, Prisma.JsonValue] => entry[1] !== undefined,
  );

  return Object.fromEntries(jsonEntries) as Prisma.InputJsonObject;
};
