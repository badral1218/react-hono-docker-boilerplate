import { env } from "@api/lib/env";
import app from "./app";

const server = Bun.serve({
  port: env.BACK_PORT,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});

console.log("server running on port:", server.port);
