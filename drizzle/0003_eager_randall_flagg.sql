CREATE TABLE `job_posting_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_posting_id` int NOT NULL,
	`applicant_email` varchar(320) NOT NULL,
	`applicant_name` varchar(255) NOT NULL,
	`status` enum('new','reviewed','rejected','accepted') NOT NULL DEFAULT 'new',
	`applied_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_posting_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employer_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`job_type` varchar(50) NOT NULL,
	`category` varchar(100) NOT NULL,
	`salary_min` int,
	`salary_max` int,
	`currency` varchar(10) NOT NULL DEFAULT 'CAD',
	`description` text NOT NULL,
	`requirements` text,
	`lmia_available` int NOT NULL DEFAULT 0,
	`visa_sponsorship` int NOT NULL DEFAULT 0,
	`accommodation_provided` int NOT NULL DEFAULT 0,
	`application_email` varchar(320) NOT NULL,
	`status` enum('draft','published','closed','archived') NOT NULL DEFAULT 'draft',
	`is_active` int NOT NULL DEFAULT 1,
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_postings_id` PRIMARY KEY(`id`)
);
