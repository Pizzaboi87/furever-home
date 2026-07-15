import { StaffRole } from "@prisma/client";
import { normalizeValue } from "./common-normalizers";

export const toStaffRole = (value: string) => {
  const role = normalizeValue(value);

  if (role.includes("volunteer")) {
    return StaffRole.VOLUNTEER_COORDINATOR;
  }

  if (
    role.includes("director") ||
    role.includes("admin") ||
    role.includes("operations")
  ) {
    return StaffRole.ADMIN;
  }

  if (role.includes("viewer")) {
    return StaffRole.VIEWER;
  }

  return StaffRole.CASE_MANAGER;
};
