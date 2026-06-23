import type { User } from "@api/lib/prisma";
import { createMiddleware } from "hono/factory";

export const roleGuard = (allowedRoles: User["role"][]) =>
  createMiddleware<{ Variables: { user: User } }>(async (c, next) => {
    const user = c.get("user");

    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ message: "Access denied" }, 403);
    }

    await next();
    return;
  });
