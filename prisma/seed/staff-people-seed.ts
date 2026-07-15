import type { PrismaClient } from "@prisma/client";

import {
  inferPersonProfileType,
  normalizePersonAddress,
  toContactChannel,
  toDate,
  toStaffRole,
} from "./seed-normalizers";
import type { RawPerson, RawStaff } from "./seed-types";

export const seedStaffUsers = async (prisma: PrismaClient, staff: RawStaff[]) => {
  for (const member of staff) {
    await prisma.staffUser.upsert({
      where: {
        id: member.id,
      },
      update: {
        name: member.name,
        email: member.email,
        role: toStaffRole(member.role),
        active: member.active ?? true,
      },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: toStaffRole(member.role),
        active: member.active ?? true,
      },
    });
  }
};

export const seedPeople = async (prisma: PrismaClient, people: RawPerson[]) => {
  for (const person of people) {
    const address = normalizePersonAddress(person.address);

    await prisma.person.upsert({
      where: {
        id: person.id,
      },
      update: {
        name: person.name,
        email: person.email || null,
        phone: person.phone || null,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        preferredContactMethod: toContactChannel(person.preferredContactMethod),
        profileType: inferPersonProfileType(person),
        tags: person.tags ?? [],
        updatedAt: toDate(person.updatedAt) ?? new Date(),
      },
      create: {
        id: person.id,
        name: person.name,
        email: person.email || null,
        phone: person.phone || null,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        preferredContactMethod: toContactChannel(person.preferredContactMethod),
        profileType: inferPersonProfileType(person),
        tags: person.tags ?? [],
        createdAt: toDate(person.createdAt),
        updatedAt:
          toDate(person.updatedAt) ?? toDate(person.createdAt) ?? new Date(),
      },
    });
  }
};
