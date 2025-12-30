CREATE TABLE `users_courses` (
	`user_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`completed_at` integer,
	PRIMARY KEY(`user_id`, `course_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
