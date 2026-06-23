import { Prisma } from "@api/lib/prisma";

export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function isPrismaUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(error) && error.code === "P2002";
}

export function isPrismaNotFoundError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(error) && error.code === "P2025";
}

const prismaErrors = {
  P2002: {
    status: 409,
    message: "A record with this information already exists.",
  },
  P2025: {
    status: 404,
    message: "The requested resource was not found.",
  },
  P2003: {
    status: 409,
    message: "Unable to complete this action due to related data.",
  },
  P2014: {
    status: 409,
    message: "This action cannot be completed. Some required information is missing.",
  },
} as const;

export function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
  customMessages?: Record<number, string>,
) {
  const errorInfo = prismaErrors[error.code as keyof typeof prismaErrors];
  if (errorInfo) {
    const { status, message } = errorInfo;
    return {
      status,
      message: customMessages?.[status] ?? message,
    } as const;
  }

  return {
    status: 500,
    message: "Internal server error",
  } as const;
}
