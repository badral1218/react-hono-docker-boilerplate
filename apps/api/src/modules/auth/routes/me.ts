import { OpenApiTags } from "@api/constants";
import { authGuard } from "@api/utils/hono/middleware/authGuard";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono } from "@hono/zod-openapi";
import { UserSchema } from "@react-template/schemas";

const getRoute = createRouteWithDefaults({
  path: "/me",
  method: "get",
  tags: [OpenApiTags.AUTH],
  middleware: [authGuard] as const,
  responses: {
    200: {
      description: "User information",
      content: {
        "application/json": {
          schema: UserSchema.pick({
            id: true,
            email: true,
            role: true,
          }),
        },
      },
    },
  },
});

const route = new OpenAPIHono().openapi(getRoute, async (c) => {
  const user = c.get("user");

  return c.json(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    200,
  );
});

export default route;
