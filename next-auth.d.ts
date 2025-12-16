import { type DefaultSession } from "next-auth";
import { UserRole } from "./db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}
