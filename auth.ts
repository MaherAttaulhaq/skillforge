import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { SQLiteDrizzleAdapter } from "@/lib/auth/sqlite-adapter";
import db from "@/db";
import * as schema from "@/db/schema";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { type Role } from "@/lib/rbac";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: SQLiteDrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }) as Adapter,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        console.log("Authorize function entered");
        console.log("Credentials:", credentials);

        if (!credentials || !credentials.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .get();

        console.log("User from DB:", user);

        if (user && user.passwordHash) {
          console.log("Comparing passwords...");
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash,
          );
          console.log("Passwords match:", passwordsMatch);

          if (passwordsMatch) {
            console.log("Authentication successful, returning user.");
            // Return a simplified user object for the session with string id
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role ?? "student",
            };
          }
        }

        console.log("Authentication failed, returning null.");
        return null; // Return null if authentication fails
      },
    }),
  ],
  // Required for Credentials provider, which does not persist data
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
