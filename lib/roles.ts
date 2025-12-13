
import { z } from "zod";

export const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
} as const;

export const RoleEnum = z.enum([ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.STUDENT]);
export type Role = z.infer<typeof RoleEnum>;

export const permissions = {
  [ROLES.ADMIN]: ["*"],
  [ROLES.INSTRUCTOR]: [
    "courses:create",
    "courses:read",
    "courses:update",
    "courses:delete",
    "teacher:dashboard:read",
  ],
  [ROLES.STUDENT]: [
    "courses:read",
    "community:create",
    "community:read",
    "community:update",
    "community:delete",
    "dashboard:read"
  ],
};

export const ROUTES = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.INSTRUCTOR]: "/teacher/dashboard",
  [ROLES.STUDENT]: "/dashboard",
};
