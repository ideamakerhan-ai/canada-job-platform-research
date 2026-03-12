CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`province` varchar(50) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `cities_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `job_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`user_id` int,
	`reason` varchar(100) NOT NULL,
	`description` text,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `noc_occupations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`noc_code` varchar(10) NOT NULL,
	`teer_level` int NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `noc_occupations_id` PRIMARY KEY(`id`),
	CONSTRAINT `noc_occupations_noc_code_unique` UNIQUE(`noc_code`)
);
--> statement-breakpoint
CREATE TABLE `recently_viewed_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`job_id` int NOT NULL,
	`viewed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recently_viewed_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`location` varchar(255),
	`summary` text,
	`experience` text,
	`education` text,
	`skills` text,
	`resume_url` varchar(500),
	`is_default` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `job_applications` ADD `resume_id` int;