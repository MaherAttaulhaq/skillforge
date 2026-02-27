PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE
);
--> statement-breakpoint
INSERT INTO `__new_categories`(`id`, `title`, `slug`) SELECT `id`, `title`, `slug` FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`description` text,
	`thumbnail` text,
	`category_id` integer NOT NULL,
	`instructor_id` text NOT NULL,
	`level` text DEFAULT 'beginner',
	`price` real DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `courses_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT `courses_instructor_id_users_id_fk` FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_courses`(`id`, `title`, `slug`, `description`, `thumbnail`, `category_id`, `instructor_id`, `level`, `price`, `created_at`) SELECT `id`, `title`, `slug`, `description`, `thumbnail`, `category_id`, `instructor_id`, `level`, `price`, `created_at` FROM `courses`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_instructors` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` text NOT NULL UNIQUE,
	`bio` text,
	`expertise` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `instructors_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_instructors`(`id`, `user_id`, `bio`, `expertise`, `created_at`) SELECT `id`, `user_id`, `bio`, `expertise`, `created_at` FROM `instructors`;--> statement-breakpoint
DROP TABLE `instructors`;--> statement-breakpoint
ALTER TABLE `__new_instructors` RENAME TO `instructors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
INSERT INTO `__new_tags`(`id`, `name`) SELECT `id`, `name` FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer,
	`password_hash` text,
	`avatar` text,
	`bio` text,
	`role` text DEFAULT 'student',
	`image` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`(`id`, `name`, `email`, `email_verified`, `password_hash`, `avatar`, `bio`, `role`, `image`, `created_at`) SELECT `id`, `name`, `email`, `email_verified`, `password_hash`, `avatar`, `bio`, `role`, `image`, `created_at` FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `categories_slug_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `courses_slug_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `instructors_user_id_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `tags_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_email_unique`;