import { OpenApiTags } from "@api/constants";
import { validateUserCredentials } from "@api/modules/auth/service";
import { signInUser } from "@api/modules/auth/utils/session";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { SignInSchema } from "@react-template/schemas";

const postRoute = createRouteWithDefaults({
  path: "/signin",
  tags: [OpenApiTags.AUTH],
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignInSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User information",
      content: {
        "application/json": {
          schema: z.object({ token: z.string() }),
        },
      },
    },
    401: {
      description: "Invalid email or password",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const route = new OpenAPIHono().openapi(postRoute, async (c) => {
  try {
    const data = c.req.valid("json");

    const user = await validateUserCredentials(data.email, data.password);

    if (!user) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    const token = await signInUser(c, user.id);

    return c.json({ token }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ message: "Invalid email or password" }, 401);
  }
});

export default route;
