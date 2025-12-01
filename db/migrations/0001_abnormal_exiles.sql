CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`match` integer,
	`logo` text NOT NULL,
	`tags` text NOT NULL,
	`posted` text NOT NULL
);
