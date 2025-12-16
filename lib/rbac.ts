import { useSession } from "next-auth/react";
import { ROLE_PERMISSIONS } from "./permissions";
import { UserRole } from "@/db/schema";

export function useRBAC(permission: string) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  if (!userRole) {
    return false;
  }

  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function hasPermission(userRole: UserRole | undefined, permission: string) {
  if (!userRole) {
    return false;
  }

  return ROLE_PERMISSIONS[userRole].includes(permission);
}
