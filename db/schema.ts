import { sqliteTable, integer, text, primaryKey, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";



/* ---------------- USERS ---------------- */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  role: text("role").$type<UserRole>().default("student"), // student | instructor | admin
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = "student" | "instructor" | "admin";

/* ---------------- INSTRUCTORS ---------------- */
export const instructors = sqliteTable("instructors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  bio: text("bio"),
  expertise: text("expertise"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Instructor = typeof instructors.$inferSelect;
export type NewInstructor = typeof instructors.$inferInsert;

/* ---------------- CATEGORIES ---------------- */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
});

export type Category = typeof categories.$inferSelect;

/* ---------------- COURSES ---------------- */
export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  instructorId: integer("instructor_id")
    .references(() => users.id)
    .notNull(),
  level: text("level").default("beginner"), // beginner | intermediate | advanced
  price: real("price").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const users_courses = sqliteTable("users_courses", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.courseId] }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  users: many(users_courses),
}));

export const usersCoursesRelations = relations(users_courses, ({ one }) => ({
  user: one(users, {
    fields: [users_courses.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [users_courses.courseId],
    references: [courses.id],
  }),
}));

/* ---------------- POSTS ---------------- */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  mediaUrl: text("media_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- TAGS ---------------- */
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export type Tag = typeof tags.$inferSelect;

/* ---------------- POSTS_TAGS ---------------- */
export const posts_tags = sqliteTable("posts_tags", {
  postId: integer("post_id").references(() => posts.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
}, (table) => ({
  pk: primaryKey(table.postId, table.tagId),
}));


/* ---------------- COMMENTS ---------------- */
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- LIKES ---------------- */
export const likes = sqliteTable("likes", {
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

/* ---------------- SHARES ---------------- */
export const shares = sqliteTable("shares", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  platform: text("platform"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- MODULES ---------------- */
export const modules = sqliteTable("modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  position: integer("position").notNull(),
});

/* ---------------- LESSONS ---------------- */
export const lessons = sqliteTable("lessons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: integer("module_id")
    .references(() => modules.id)
    .notNull(),
  title: text("title").notNull(),
  content: text("content"),
  videoUrl: text("video_url"),
  position: integer("position").notNull(),
});

/* ---------------- ENROLLMENTS ---------------- */
export const enrollments = sqliteTable("enrollments", {
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  enrolledAt: text("enrolled_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseId] }),
}));

/* ---------------- LESSON PROGRESS ---------------- */
export const lessonProgress = sqliteTable("lesson_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- COURSE REVIEWS ---------------- */
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1–5
  comment: text("comment"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- AI GENERATED CONTENT ---------------- */
export const aiContent = sqliteTable("ai_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // summary | explanation | quiz | flashcard
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- NOTIFICATIONS ---------------- */
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- USER SKILLS ---------------- */
export const userSkills = sqliteTable("user_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  skill: text("skill").notNull(),
  level: text("level").default("beginner"), // beginner | intermediate | expert
});

/* ---------------- CERTIFICATES ---------------- */
export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  certificateUrl: text("certificate_url").notNull(),
  issueDate: text("issue_date").default(sql`CURRENT_TIMESTAMP`),
});

/* ---------------- JOBS ---------------- */
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  match: integer("match"),
  logo: text("logo").notNull(),
  tags: text("tags").notNull(),
  posted: text("posted").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  benefits: text("benefits"),
  apply: text("apply"),
  salary: text("salary"),
  type: text("type"), // Full-time, Part-time, Contract
  workMode: text("work_mode"), // Remote, On-site, Hybrid
  experience: text("experience"), // e.g. "5+ Years"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
});

// ---------------- ACCOUNTS ----------------
export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});
 
// ---------------- SESSIONS ----------------
export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// ---------------- VERIFICATION TOKENS ----------------
export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));