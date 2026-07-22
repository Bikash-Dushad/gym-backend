CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(10) NOT NULL,
	`bloodGroup` varchar(5),
	`age` int NOT NULL,
	`height` decimal(3,1) NOT NULL,
	`isActive` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `membershipPlans` (
	`id` char(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`validity` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `membershipPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `membership` (
	`id` char(36) NOT NULL,
	`membershipPlan` char(36) NOT NULL,
	`user` char(36) NOT NULL,
	`price` int NOT NULL,
	`trainer` char(36) DEFAULT null,
	`subscribedDate` timestamp DEFAULT (now()),
	`expiry_date` timestamp NOT NULL,
	`isActive` boolean DEFAULT true,
	`isExpired` boolean DEFAULT false,
	`weight` decimal(3,1) NOT NULL,
	`type` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `membership_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trainer` (
	`id` char(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(10) NOT NULL,
	`age` int NOT NULL,
	`height` decimal(3,1) NOT NULL,
	`price` int NOT NULL,
	`salary` int NOT NULL,
	`isActive` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `trainer_id` PRIMARY KEY(`id`),
	CONSTRAINT `trainer_email_unique` UNIQUE(`email`),
	CONSTRAINT `trainer_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `admin` (
	`id` char(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(10) NOT NULL,
	`password` varchar(255) NOT NULL,
	`avatar` varchar(255),
	`otp` varchar(6),
	`isActve` boolean DEFAULT true,
	`isDeleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_email_unique` UNIQUE(`email`),
	CONSTRAINT `admin_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `membership` ADD CONSTRAINT `membership_membershipPlan_membershipPlans_id_fk` FOREIGN KEY (`membershipPlan`) REFERENCES `membershipPlans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `membership` ADD CONSTRAINT `membership_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `membership` ADD CONSTRAINT `membership_trainer_trainer_id_fk` FOREIGN KEY (`trainer`) REFERENCES `trainer`(`id`) ON DELETE no action ON UPDATE no action;