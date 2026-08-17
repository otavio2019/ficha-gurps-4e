import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { gurpsCharacters, gurpsCharacterShares, gurpsSkillCatalog, InsertUser, users } from "../drizzle/schema";
import { filterSkillCatalog } from "../shared/gurpsSkillCatalog";
import { ENV } from './_core/env';
import { getGurpsSkillCatalogSeed } from "./skillCatalogSeed";

let _db: ReturnType<typeof drizzle> | null = null;
type SkillCatalogReadRepository = { list: () => Promise<Array<typeof gurpsSkillCatalog.$inferSelect>> };

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listGurpsCharacters(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gurpsCharacters).where(eq(gurpsCharacters.ownerId, ownerId));
}

export async function getGurpsCharacter(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gurpsCharacters).where(eq(gurpsCharacters.id, id)).limit(1);
  return result[0];
}

export async function saveGurpsCharacter(input: { id: string; ownerId: number; name: string; sheet: Record<string, unknown>; portraitUrl?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(gurpsCharacters).values({
    id: input.id,
    ownerId: input.ownerId,
    name: input.name,
    sheet: input.sheet,
    portraitUrl: input.portraitUrl ?? null,
  }).onDuplicateKeyUpdate({
    set: { name: input.name, sheet: input.sheet, portraitUrl: input.portraitUrl ?? null },
  });
  return getGurpsCharacter(input.id);
}

export async function deleteGurpsCharacter(id: string, ownerId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(gurpsCharacterShares).where(and(eq(gurpsCharacterShares.characterId, id), eq(gurpsCharacterShares.ownerId, ownerId)));
  await db.delete(gurpsCharacters).where(and(eq(gurpsCharacters.id, id), eq(gurpsCharacters.ownerId, ownerId)));
}

export async function getCharacterShare(characterId: string, ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gurpsCharacterShares).where(and(eq(gurpsCharacterShares.characterId, characterId), eq(gurpsCharacterShares.ownerId, ownerId))).limit(1);
  return result[0];
}

export async function listCharacterShares(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gurpsCharacterShares).where(eq(gurpsCharacterShares.ownerId, ownerId));
}

export async function createCharacterShare(input: { characterId: string; ownerId: number; token: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(gurpsCharacterShares).values(input);
  return getCharacterShare(input.characterId, input.ownerId);
}

export async function getSharedGurpsCharacter(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const share = await db.select().from(gurpsCharacterShares).where(eq(gurpsCharacterShares.token, token)).limit(1);
  if (!share[0]) return undefined;
  return getGurpsCharacter(share[0].characterId);
}

export async function listGurpsSkillCatalog(query = "", repository?: SkillCatalogReadRepository) {
  if (repository) return filterSkillCatalog(await repository.list(), query);
  const db = await getDb();
  if (!db) return [];
  const records = await db.select().from(gurpsSkillCatalog).orderBy(asc(gurpsSkillCatalog.name));
  return filterSkillCatalog(records, query);
}

export async function seedGurpsSkillCatalog() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const existing = await db.select({ id: gurpsSkillCatalog.id }).from(gurpsSkillCatalog).limit(1);
  if (!existing.length) await db.insert(gurpsSkillCatalog).values(getGurpsSkillCatalogSeed());
  const records = await db.select({ id: gurpsSkillCatalog.id }).from(gurpsSkillCatalog);
  return records.length;
}
