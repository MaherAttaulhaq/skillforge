PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`skill` text NOT NULL,
	`level` text DEFAULT 'beginner',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_skills`("id", "user_id", "skill", "level") SELECT "id", "user_id", "skill", "level" FROM `user_skills`;--> statement-breakpoint
DROP TABLE `user_skills`;--> statement-breakpoint
ALTER TABLE `__new_user_skills` RENAME TO `user_skills`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;