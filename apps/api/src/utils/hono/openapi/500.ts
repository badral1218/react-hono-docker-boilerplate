import { z } from "zod";

export const default500ResponseSchema = z.object({
  success: z.literal(false).default(false),
  message: z.string().default("Internal Server Error"),
});

export const default500Response = default500ResponseSchema.parse({});

export const default500ResponseDefinition = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: default500ResponseSchema,
    },
  },
} as const;
