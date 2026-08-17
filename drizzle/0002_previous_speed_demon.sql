ALTER TABLE `gurps_skill_catalog` ADD `originalName` varchar(180) NOT NULL DEFAULT '';--> statement-breakpoint
CREATE INDEX `gurps_skill_catalog_original_name_index` ON `gurps_skill_catalog` (`originalName`);
