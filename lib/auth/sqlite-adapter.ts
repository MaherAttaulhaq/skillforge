import type { Adapter } from "next-auth/adapters";
import { and, eq, getTableColumns } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

type SQLiteSchema = {
  usersTable?: any;
  accountsTable?: any;
  sessionsTable?: any;
  verificationTokensTable?: any;
  authenticatorsTable?: any;
};

function defineTables(schema: SQLiteSchema = {}) {
  const usersTable =
    schema.usersTable ??
    sqliteTable("user", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name"),
      email: text("email").unique(),
      emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
      image: text("image"),
    });

  const accountsTable =
    schema.accountsTable ??
    sqliteTable(
      "account",
      {
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text("type").$type<any>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
      },
      (account) => ({
        compositePk: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      }),
    );

  const sessionsTable =
    schema.sessionsTable ??
    sqliteTable("session", {
      sessionToken: text("sessionToken").primaryKey(),
      userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    });

  const verificationTokensTable =
    schema.verificationTokensTable ??
    sqliteTable(
      "verificationToken",
      {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
      },
      (verificationToken) => ({
        compositePk: primaryKey({
          columns: [verificationToken.identifier, verificationToken.token],
        }),
      }),
    );

  const authenticatorsTable =
    schema.authenticatorsTable ??
    sqliteTable(
      "authenticator",
      {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: integer("credentialBackedUp", {
          mode: "boolean",
        }).notNull(),
        transports: text("transports"),
      },
      (authenticator) => ({
        compositePK: primaryKey({
          columns: [authenticator.userId, authenticator.credentialID],
        }),
      }),
    );

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  };
}

export function SQLiteDrizzleAdapter(client: any, schema?: SQLiteSchema): Adapter {
  const {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  } = defineTables(schema);

  return {
    async createUser(data: any) {
      const { id, ...insertData } = data;
      const hasDefaultId = getTableColumns(usersTable).id.hasDefault;
      return client
        .insert(usersTable)
        .values(hasDefaultId ? insertData : { ...insertData, id })
        .returning()
        .get();
    },
    async getUser(userId: string) {
      return (
        (await client.select().from(usersTable).where(eq(usersTable.id, userId)).get()) ??
        null
      );
    },
    async getUserByEmail(email: string) {
      return (
        (await client
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .get()) ?? null
      );
    },
    async createSession(data: any) {
      return client.insert(sessionsTable).values(data).returning().get();
    },
    async getSessionAndUser(sessionToken: string) {
      return (
        (await client
          .select({ session: sessionsTable, user: usersTable })
          .from(sessionsTable)
          .where(eq(sessionsTable.sessionToken, sessionToken))
          .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
          .get()) ?? null
      );
    },
    async updateUser(data: any) {
      if (!data.id) throw new Error("No user id.");
      const result = await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning()
        .get();
      if (!result) throw new Error("User not found.");
      return result;
    },
    async updateSession(data: any) {
      return (
        (await client
          .update(sessionsTable)
          .set(data)
          .where(eq(sessionsTable.sessionToken, data.sessionToken))
          .returning()
          .get()) ?? null
      );
    },
    async linkAccount(data: any) {
      await client.insert(accountsTable).values(data).run();
    },
    async getUserByAccount(account: { provider: string; providerAccountId: string }) {
      const result = await client
        .select({ account: accountsTable, user: usersTable })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId),
          ),
        )
        .get();
      return result?.user ?? null;
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .run();
    },
    async createVerificationToken(data: any) {
      return client.insert(verificationTokensTable).values(data).returning().get();
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return (
        (await client
          .delete(verificationTokensTable)
          .where(
            and(
              eq(verificationTokensTable.identifier, params.identifier),
              eq(verificationTokensTable.token, params.token),
            ),
          )
          .returning()
          .get()) ?? null
      );
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id)).run();
    },
    async unlinkAccount(params: { provider: string; providerAccountId: string }) {
      await client
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId),
          ),
        )
        .run();
    },
    async getAccount(providerAccountId: string, provider: string) {
      return client
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId),
          ),
        )
        .then((res: any[]) => res[0] ?? null);
    },
    async createAuthenticator(data: any) {
      return client
        .insert(authenticatorsTable)
        .values(data)
        .returning()
        .then((res: any[]) => res[0] ?? null);
    },
    async getAuthenticator(credentialID: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res: any[]) => res[0] ?? null);
    },
    async listAuthenticatorsByUserId(userId: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))
        .then((res: any[]) => res);
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await client
        .update(authenticatorsTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .returning()
        .then((res: any[]) => res[0]);

      if (!authenticator) throw new Error("Authenticator not found.");
      return authenticator;
    },
  };
}
