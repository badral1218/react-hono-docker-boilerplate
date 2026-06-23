import { verifyUserPassword } from "@api/lib/auth";
import { prisma } from "@api/lib/prisma";

export const validateUserCredentials = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) return null;

  const isVerified = await verifyUserPassword({
    passwordHash: user.passwordHash,
    password,
  });
  return isVerified ? user : null;
};
