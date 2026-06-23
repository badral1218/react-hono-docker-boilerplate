import { Prisma } from "@api/lib/prisma";
import { handlePrismaError } from "@api/utils/prismaError";
import type { Context } from "hono";

export function handleError(c: Context, error: unknown, customMessages?: Record<number, string>) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message } = handlePrismaError(error, customMessages);
    return c.json({ message }, status);
  }

  return c.json({ message: "Internal server error" }, 500);
}
