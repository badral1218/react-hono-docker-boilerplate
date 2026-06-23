import { USER_SESSION_EXPIRATION_S } from "@api/constants";
import { createSession, generateSessionToken } from "@api/lib/auth";
import { isDev } from "@api/lib/env";
import type { User } from "@api/lib/prisma";
import { USER_SESSION_COOKIE_NAME } from "@react-template/constants";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export async function signInUser(c: Context, userId: User["id"]): Promise<string> {
  const token = generateSessionToken();

  await createSession(token, userId);

  setCookie(c, USER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: !isDev,
    sameSite: "Lax",
    maxAge: USER_SESSION_EXPIRATION_S,
  });

  return token;
}
