import { OpenApiTags } from "@api/constants";
import { getSessionIdFromToken, invalidateSession } from "@api/lib/auth";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { USER_SESSION_COOKIE_NAME } from "@react-template/constants";
import { deleteCookie, getCookie } from "hono/cookie";

const signoutRoute = createRouteWithDefaults({
  path: "/signout",
  method: "post",
  tags: [OpenApiTags.AUTH],
  responses: {
    200: {
      description: "User signed out",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: "User unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

const route = new OpenAPIHono().openapi(signoutRoute, async (c) => {
  const token = getCookie(c, USER_SESSION_COOKIE_NAME);

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const sessionId = getSessionIdFromToken(token);
  deleteCookie(c, USER_SESSION_COOKIE_NAME);
  await invalidateSession(sessionId);

  return c.json({ message: "Successfully signed out" }, 200);
});

export default route;
