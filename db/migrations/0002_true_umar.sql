ALTER TABLE `jobs` ADD `description` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `requirements` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `benefits` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `apply` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `jobs` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `jobs` ADD `deleted_at` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `is_deleted` integer DEFAULT false;