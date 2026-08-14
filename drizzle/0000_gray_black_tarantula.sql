CREATE TABLE `gurps_character_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`characterId` varchar(64) NOT NULL,
	`ownerId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gurps_character_shares_id` PRIMARY KEY(`id`),
	CONSTRAINT `gurps_character_shares_token_unique` UNIQUE(`token`),
	CONSTRAINT `gurps_character_shares_character_unique` UNIQUE(`characterId`)
);
--> statement-breakpoint
CREATE TABLE `gurps_characters` (
	`id` varchar(64) NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`portraitUrl` text,
	`sheet` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gurps_characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
