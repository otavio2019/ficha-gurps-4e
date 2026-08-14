import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createCharacterShare, deleteGurpsCharacter, getCharacterShare, getGurpsCharacter, getSharedGurpsCharacter, listCharacterShares, listGurpsCharacters, saveGurpsCharacter } from "./db";
import { parsePortraitDataUrl } from "./characterUtils";
import { emitCharacterUpdated } from "./live";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { storagePut } from "./storage";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const characterInput = z.object({
  id: z.string().min(4).max(64),
  name: z.string().min(1).max(160),
  portraitUrl: z.string().nullable().optional(),
  sheet: z.record(z.string(), z.unknown()),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  characters: router({
    list: protectedProcedure.query(({ ctx }) => listGurpsCharacters(ctx.user.id)),
    save: protectedProcedure.input(characterInput).mutation(async ({ ctx, input }) => {
      const existing = await getGurpsCharacter(input.id);
      if (existing && existing.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode editar esta ficha." });
      const saved = await saveGurpsCharacter({ ...input, ownerId: ctx.user.id });
      if (!saved) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível salvar a ficha." });
      const share = await getCharacterShare(input.id, ctx.user.id);
      emitCharacterUpdated({ characterId: input.id, shareToken: share?.token, updatedAt: Date.now() });
      return saved;
    }),
    remove: protectedProcedure.input(z.object({ id: z.string().min(4).max(64) })).mutation(async ({ ctx, input }) => {
      const character = await getGurpsCharacter(input.id);
      if (!character || character.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode excluir esta ficha." });
      await deleteGurpsCharacter(input.id, ctx.user.id);
      return { success: true } as const;
    }),
    share: protectedProcedure.input(z.object({ characterId: z.string().min(4).max(64) })).mutation(async ({ ctx, input }) => {
      const character = await getGurpsCharacter(input.characterId);
      if (!character || character.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode compartilhar esta ficha." });
      const existing = await getCharacterShare(input.characterId, ctx.user.id);
      const share = existing ?? await createCharacterShare({ characterId: input.characterId, ownerId: ctx.user.id, token: nanoid(24) });
      return { token: share?.token };
    }),
    uploadPortrait: protectedProcedure.input(z.object({ characterId: z.string().min(4).max(64), dataUrl: z.string().min(32).max(7_000_000) })).mutation(async ({ ctx, input }) => {
      const character = await getGurpsCharacter(input.characterId);
      if (!character || character.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode alterar o retrato desta ficha." });
      const portrait = parsePortraitDataUrl(input.dataUrl);
      if (!portrait || portrait.buffer.byteLength > 4_000_000) throw new TRPCError({ code: "BAD_REQUEST", message: "Envie uma imagem PNG, JPEG ou WEBP de até 4 MB." });
      const { url } = await storagePut(`gurps/${ctx.user.id}/${input.characterId}/portrait.${portrait.extension}`, portrait.buffer, portrait.contentType);
      const saved = await saveGurpsCharacter({ id: character.id, ownerId: ctx.user.id, name: character.name, sheet: character.sheet, portraitUrl: url });
      const share = await getCharacterShare(input.characterId, ctx.user.id);
      emitCharacterUpdated({ characterId: input.characterId, shareToken: share?.token, updatedAt: Date.now() });
      return { portraitUrl: saved?.portraitUrl ?? url };
    }),
  }),
  shares: router({
    list: protectedProcedure.query(({ ctx }) => listCharacterShares(ctx.user.id)),
  }),
  shared: router({
    get: publicProcedure.input(z.object({ token: z.string().min(8).max(64) })).query(async ({ input }) => {
      const character = await getSharedGurpsCharacter(input.token);
      if (!character) throw new TRPCError({ code: "NOT_FOUND", message: "Ficha compartilhada não encontrada." });
      return character;
    }),
  }),
});

export type AppRouter = typeof appRouter;
