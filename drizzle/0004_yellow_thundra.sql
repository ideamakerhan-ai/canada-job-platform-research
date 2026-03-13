CREATE TABLE `admin_dashboard_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`target_type` varchar(50) NOT NULL,
	`target_id` int NOT NULL,
	`details` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_dashboard_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employer_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`company_website` varchar(500),
	`company_phone` varchar(20),
	`company_description` text,
	`industry_type` varchar(100),
	`employee_count` varchar(50),
	`verification_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employer_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employer_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `job_posting_compliance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_posting_id` int NOT NULL,
	`uses_ai` int NOT NULL DEFAULT 0,
	`vacancy_status` enum('existing','future') NOT NULL DEFAULT 'existing',
	`interview_date` timestamp,
	`notification_sent_date` timestamp,
	`canadian_experience_required` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_posting_compliance_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_posting_compliance_job_posting_id_unique` UNIQUE(`job_posting_id`)
);
--> statement-breakpoint
CREATE TABLE `job_posting_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_posting_id` int NOT NULL,
	`reporter_email` varchar(320) NOT NULL,
	`reason` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','reviewed','removed','dismissed') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`reviewed_at` timestamp,
	`reviewed_by` int,
	CONSTRAINT `job_posting_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employer_id` int NOT NULL,
	`stripe_payment_id` varchar(255) NOT NULL,
	`package_type` varchar(50) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'CAD',
	`job_posting_count` int NOT NULL,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripe_payment_id_unique` UNIQUE(`stripe_payment_id`)
);
