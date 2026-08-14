import { createServer } from "http";
import { afterEach, describe, expect, it } from "vitest";
import { io, type Socket } from "socket.io-client";
import { emitCharacterUpdated, registerLiveGateway } from "./live";

describe("live collaboration gateway", () => {
  let client: Socket | undefined;
  let server = createServer();

  afterEach(async () => {
    client?.disconnect();
    await new Promise<void>(resolve => server.close(() => resolve()));
  });

  it("delivers an instant update to the watched character room", async () => {
    registerLiveGateway(server);
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Servidor de teste indisponível");

    client = io(`http://127.0.0.1:${address.port}`, { path: "/api/live", transports: ["websocket"] });
    await new Promise<void>((resolve, reject) => {
      client?.once("connect", () => resolve());
      client?.once("connect_error", reject);
    });

    const received = new Promise<{ characterId: string; shareToken?: string }>(resolve => client?.once("character-updated", resolve));
    client.emit("watch-character", "character-test");
    await new Promise(resolve => setTimeout(resolve, 25));
    emitCharacterUpdated({ characterId: "character-test", shareToken: "share-test", updatedAt: Date.now() });

    await expect(received).resolves.toMatchObject({ characterId: "character-test", shareToken: "share-test" });
  });
});
