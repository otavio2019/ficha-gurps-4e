CREATE TABLE `gurps_trait_catalog` (
	`id` varchar(80) NOT NULL,
	`name` varchar(180) NOT NULL,
	`originalName` varchar(180) NOT NULL DEFAULT '',
	`kind` varchar(24) NOT NULL,
	`cost` int NOT NULL,
	`costLabel` varchar(80) NOT NULL,
	`category` varchar(80) NOT NULL,
	`nature` varchar(40) NOT NULL,
	`availability` varchar(40) NOT NULL,
	`variableCost` boolean NOT NULL DEFAULT false,
	`requiresSelfControl` boolean NOT NULL DEFAULT false,
	`summary` text,
	`reference` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gurps_trait_catalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `gurps_trait_catalog_name_index` ON `gurps_trait_catalog` (`name`);--> statement-breakpoint
CREATE INDEX `gurps_trait_catalog_original_name_index` ON `gurps_trait_catalog` (`originalName`);--> statement-breakpoint
CREATE INDEX `gurps_trait_catalog_kind_index` ON `gurps_trait_catalog` (`kind`);--> statement-breakpoint
CREATE INDEX `gurps_trait_catalog_category_index` ON `gurps_trait_catalog` (`category`);