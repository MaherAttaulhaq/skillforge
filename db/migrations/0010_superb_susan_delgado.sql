PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state") SELECT "user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_ai_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`prompt` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ai_content`("id", "user_id", "type", "prompt", "result", "created_at") SELECT "id", "user_id", "type", "prompt", "result", "created_at" FROM `ai_content`;--> statement-breakpoint
DROP TABLE `ai_content`;--> statement-breakpoint
ALTER TABLE `__new_ai_content` RENAME TO `ai_content`;--> statement-breakpoint
CREATE TABLE `__new_applications` (
	`user_id` text NOT NULL,
	`job_id` integer NOT NULL,
	`applied_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `job_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_applications`("user_id", "job_id", "applied_at") SELECT "user_id", "job_id", "applied_at" FROM `applications`;--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
ALTER TABLE `__new_applications` RENAME TO `applications`;--> statement-breakpoint
CREATE TABLE `__new_certificates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`course_id` integer NOT NULL,
	`certificate_url` text NOT NULL,
	`issue_date` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_certificates`("id", "user_id", "course_id", "certificate_url", "issue_date") SELECT "id", "user_id", "course_id", "certificate_url", "issue_date" FROM `certificates`;--> statement-breakpoint
DROP TABLE `certificates`;--> statement-breakpoint
ALTER TABLE `__new_certificates` RENAME TO `certificates`;--> statement-breakpoint
CREATE TABLE `__new_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`post_id` integer NOT NULL,
	`author_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_comments`("id", "content", "post_id", "author_id", "created_at") SELECT "id", "content", "post_id", "author_id", "created_at" FROM `comments`;--> statement-breakpoint
DROP TABLE `comments`;--> statement-breakpoint
ALTER TABLE `__new_comments` RENAME TO `comments`;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`thumbnail` text,
	`category_id` integer NOT NULL,
	`instructor_id` text NOT NULL,
	`level` text DEFAULT 'beginner',
	`price` real DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_courses`("id", "title", "slug", "description", "thumbnail", "category_id", "instructor_id", "level", "price", "created_at") SELECT "id", "title", "slug", "description", "thumbnail", "category_id", "instructor_id", "level", "price", "created_at" FROM `courses`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_enrollments` (
	`user_id` text NOT NULL,
	`course_id` integer NOT NULL,
	`enrolled_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `course_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_enrollments`("user_id", "course_id", "enrolled_at") SELECT "user_id", "course_id", "enrolled_at" FROM `enrollments`;--> statement-breakpoint
DROP TABLE `enrollments`;--> statement-breakpoint
ALTER TABLE `__new_enrollments` RENAME TO `enrollments`;--> statement-breakpoint
CREATE TABLE `__new_instructors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`bio` text,
	`expertise` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_instructors`("id", "user_id", "bio", "expertise", "created_at") SELECT "id", "user_id", "bio", "expertise", "created_at" FROM `instructors`;--> statement-breakpoint
DROP TABLE `instructors`;--> statement-breakpoint
ALTER TABLE `__new_instructors` RENAME TO `instructors`;--> statement-breakpoint
CREATE UNIQUE INDEX `instructors_user_id_unique` ON `instructors` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_lesson_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` integer NOT NULL,
	`is_completed` integer DEFAULT false,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_lesson_progress`("id", "user_id", "lesson_id", "is_completed", "updated_at") SELECT "id", "user_id", "lesson_id", "is_completed", "updated_at" FROM `lesson_progress`;--> statement-breakpoint
DROP TABLE `lesson_progress`;--> statement-breakpoint
ALTER TABLE `__new_lesson_progress` RENAME TO `lesson_progress`;--> statement-breakpoint
CREATE TABLE `__new_likes` (
	`user_id` text NOT NULL,
	`post_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `post_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_likes`("user_id", "post_id", "created_at") SELECT "user_id", "post_id", "created_at" FROM `likes`;--> statement-breakpoint
DROP TABLE `likes`;--> statement-breakpoint
ALTER TABLE `__new_likes` RENAME TO `likes`;--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`message` text,
	`is_read` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "user_id", "title", "message", "is_read", "created_at") SELECT "id", "user_id", "title", "message", "is_read", "created_at" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`author_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`media_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "content", "author_id", "category_id", "media_url", "created_at") SELECT "id", "title", "content", "author_id", "category_id", "media_url", "created_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
CREATE TABLE `__new_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`course_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_purchases`("id", "user_id", "course_id", "created_at") SELECT "id", "user_id", "course_id", "created_at" FROM `purchases`;--> statement-breakpoint
DROP TABLE `purchases`;--> statement-breakpoint
ALTER TABLE `__new_purchases` RENAME TO `purchases`;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "course_id", "user_id", "rating", "comment", "created_at") SELECT "id", "course_id", "user_id", "rating", "comment", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE TABLE `__new_saved_jobs` (
	`user_id` text NOT NULL,
	`job_id` integer NOT NULL,
	`saved_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `job_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_saved_jobs`("user_id", "job_id", "saved_at") SELECT "user_id", "job_id", "saved_at" FROM `saved_jobs`;--> statement-breakpoint
DROP TABLE `saved_jobs`;--> statement-breakpoint
ALTER TABLE `__new_saved_jobs` RENAME TO `saved_jobs`;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("session_token", "user_id", "expires") SELECT "session_token", "user_id", "expires" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE TABLE `__new_shares` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`post_id` integer NOT NULL,
	`platform` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_shares`("id", "user_id", "post_id", "platform", "created_at") SELECT "id", "user_id", "post_id", "platform", "created_at" FROM `shares`;--> statement-breakpoint
DROP TABLE `shares`;--> statement-breakpoint
ALTER TABLE `__new_shares` RENAME TO `shares`;--> statement-breakpoint
CREATE TABLE `__new_user_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`skill` text NOT NULL,
	`level` text DEFAULT 'beginner',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_skills`("id", "user_id", "skill", "level") SELECT "id", "user_id", "skill", "level" FROM `user_skills`;--> statement-breakpoint
DROP TABLE `user_skills`;--> statement-breakpoint
ALTER TABLE `__new_user_skills` RENAME TO `user_skills`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer,
	`password_hash` text,
	`avatar` text,
	`bio` text,
	`role` text DEFAULT 'student',
	`image` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "email_verified", "password_hash", "avatar", "bio", "role", "image", "created_at") SELECT "id", "name", "email", "email_verified", "password_hash", "avatar", "bio", "role", "image", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_users_courses` (
	`user_id` text NOT NULL,
	`course_id` integer NOT NULL,
	`completed_at` integer,
	PRIMARY KEY(`user_id`, `course_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_users_courses`("user_id", "course_id", "completed_at") SELECT "user_id", "course_id", "completed_at" FROM `users_courses`;--> statement-breakpoint
DROP TABLE `users_courses`;--> statement-breakpoint
ALTER TABLE `__new_users_courses` RENAME TO `users_courses`;