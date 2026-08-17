CREATE TABLE `gurps_skill_catalog` (
	`id` varchar(80) NOT NULL,
	`name` varchar(180) NOT NULL,
	`attribute` varchar(32) NOT NULL,
	`difficulty` varchar(32) NOT NULL,
	`category` varchar(80) NOT NULL,
	`requiresSpecialization` boolean NOT NULL DEFAULT false,
	`usesTechLevel` boolean NOT NULL DEFAULT false,
	`summary` text,
	`reference` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gurps_skill_catalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `gurps_skill_catalog_name_index` ON `gurps_skill_catalog` (`name`);--> statement-breakpoint
CREATE INDEX `gurps_skill_catalog_category_index` ON `gurps_skill_catalog` (`category`);