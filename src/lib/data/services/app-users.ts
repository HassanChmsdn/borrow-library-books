import type { AppUserRole } from "@/lib/db";

import {
  findUserRecordByAuth0Subject,
  findUserRecordByMockRole,
} from "../repositories/users";

export function lookupAppUserByAuth0Identity(subject: string) {
  return findUserRecordByAuth0Subject(subject);
}

export function lookupAppUserByMockRole(role: AppUserRole) {
  return findUserRecordByMockRole(role);
}