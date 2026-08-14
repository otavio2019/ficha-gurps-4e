import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

type CharacterUpdate = { characterId: string; shareToken?: string; updatedAt: number };

let liveServer: Server | null = null;

export function registerLiveGateway(server: HttpServer) {
  liveServer = new Server(server, {
    path: "/api/live",
    cors: { origin: true, credentials: true },
  });

  liveServer.on("connection", socket => {
    socket.on("watch-character", (characterId: unknown) => {
      if (typeof characterId === "string" && characterId.length <= 64) socket.join(`character:${characterId}`);
    });
    socket.on("watch-share", (shareToken: unknown) => {
      if (typeof shareToken === "string" && shareToken.length <= 64) socket.join(`share:${shareToken}`);
    });
  });
}

export function emitCharacterUpdated(event: CharacterUpdate) {
  if (!liveServer) return;
  liveServer.to(`character:${event.characterId}`).emit("character-updated", event);
  if (event.shareToken) liveServer.to(`share:${event.shareToken}`).emit("character-updated", event);
}
