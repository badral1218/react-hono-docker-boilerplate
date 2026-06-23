import { validateSessionToken } from "@api/lib/auth";
import type { User } from "@api/lib/prisma";
import { USER_SESSION_COOKIE_NAME } from "@react-template/constants";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { default401Response } from "../openapi/401";

export const authGuard = createMiddleware<{ Variables: { user: User } }>(async (c, next) => {
  const token = getCookie(c, USER_SESSION_COOKIE_NAME);

  if (!token) {
    return c.json(default401Response, 401);
  }

  try {
    const { user } = await validateSessionToken(token);
    if (!user) {
      throw new Error("not a valid token");
    }
    c.set("user", user);
    await next();
    return;
  } catch (_error) {
    return c.json(default401Response, 401);
  }
});
