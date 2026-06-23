import { z } from "zod";

export const default401ResponseSchema = z.object({
  message: z.string().default("Unauthorized"),
});

export const default401Response = default401ResponseSchema.parse({});

export const default401ResponseDefinition = {
  description: "Unauthorized",
  content: {
    "application/json": {
      schema: default401ResponseSchema,
    },
  },
} as const;
