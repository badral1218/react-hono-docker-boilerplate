import { isDev, isProd } from "@api/lib/env";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import routes from "./routes";

const app = new OpenAPIHono();

app.use("*", logger());

app.route("/", routes);

app.onError((err, c) => {
  return c.json(
    {
      message: err.message,
      stack: isProd ? undefined : err.stack,
    },
    500,
  );
});

if (isDev) {
  app
    .doc("/api/openapi.json", {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Whistler",
      },
    })
    .get(
      "/api/docs",
      swaggerUI({
        url: "/api/openapi.json",
      }),
    );
}

// In development environment use vite dev server for frontend app instead
if (!isDev) {
  app.get("*", serveStatic({ root: "./public" }));
  app.get(serveStatic({ path: "./public/index.html" }));
}

export default app;
