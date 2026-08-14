import { io } from "socket.io-client";

export const liveSocket = io({
  autoConnect: false,
  path: "/api/live",
  transports: ["websocket", "polling"],
});
