import { z } from "zod";

export const errorResponse = (description: string) =>
  ({
    description,
    content: {
      "application/json": {
        schema: z.object({
          message: z.string().default(description),
        }),
      },
    },
  }) as const;
