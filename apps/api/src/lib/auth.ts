import crypto from "node:crypto";
import { USER_SESSION_EXPIRATION_MS } from "@api/constants";
import type { Session, User } from "@api/lib/prisma";
import { prisma } from "@api/lib/prisma";
import { encodeBase32LowerCaseNoPadding } from "@api/utils/crypto";

export function getSessionIdFromToken(token: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(token);
  const sessionId = hasher.digest("hex");

  return sessionId;
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: User["id"]): Promise<Session> {
  const sessionId = getSessionIdFromToken(token);

  const createdSession = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + USER_SESSION_EXPIRATION_MS),
    },
  });

  return createdSession;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = getSessionIdFromToken(token);

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!session) {
    return { session: null, user: null };
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
      deletedAt: null,
    },
  });

  if (!user) {
    return { session: null, user: null };
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: User["id"]): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}

export async function verifyUserPassword({
  passwordHash,
  password,
}: {
  passwordHash: string;
  password: string;
}): Promise<boolean> {
  const isMatch = await Bun.password.verify(password, passwordHash);
  return isMatch;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
