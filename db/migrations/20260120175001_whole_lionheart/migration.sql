CREATE TABLE `applications` (
	`user_id` integer NOT NULL,
	`job_id` integer NOT NULL,
	`applied_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `job_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `saved_jobs` (
	`user_id` integer NOT NULL,
	`job_id` integer NOT NULL,
	`saved_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `job_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
