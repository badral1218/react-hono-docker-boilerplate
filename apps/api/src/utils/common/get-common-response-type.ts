import { type RouteConfig, z } from "@hono/zod-openapi";

export const getCommonResponseType = (description: string) => {
  const response = {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: description,
    },
  };

  return response;
};
