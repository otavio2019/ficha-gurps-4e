import { int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const gurpsCharacters = mysqlTable("gurps_characters", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  portraitUrl: text("portraitUrl"),
  sheet: json("sheet").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const gurpsCharacterShares = mysqlTable("gurps_character_shares", {
  id: int("id").autoincrement().primaryKey(),
  characterId: varchar("characterId", { length: 64 }).notNull(),
  ownerId: int("ownerId").notNull(),
  token: varchar("token", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  tokenUnique: uniqueIndex("gurps_character_shares_token_unique").on(table.token),
  characterUnique: uniqueIndex("gurps_character_shares_character_unique").on(table.characterId),
}));

export type GurpsCharacter = typeof gurpsCharacters.$inferSelect;
export type InsertGurpsCharacter = typeof gurpsCharacters.$inferInsert;
