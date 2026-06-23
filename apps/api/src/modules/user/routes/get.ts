import { OpenApiTags } from "@api/constants";
import { prisma } from "@api/lib/prisma";
import { authGuard } from "@api/utils/hono/middleware/authGuard";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";

const openAPIDefinition = createRouteWithDefaults({
  path: "/",
  method: "get",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            users: z.array(
              z.object({
                id: z.string(),
                email: z.string(),
                name: z.string().nullable(),
              }),
            ),
          }),
        },
      },
      description: "List users",
    },
  },
  tags: [OpenApiTags.USER],
  middleware: [authGuard] as const,
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { id: "asc" },
  });
  return c.json({ users }, 200);
});

export default route;
