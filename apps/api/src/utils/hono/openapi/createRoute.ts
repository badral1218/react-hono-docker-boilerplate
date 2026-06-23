import { errorResponse } from "@api/utils/hono/openapi/errorResponses";
import { createRoute, type RouteConfig } from "@hono/zod-openapi";

export const createRouteWithDefaults = <
  P extends string,
  R extends Omit<RouteConfig, "path"> & {
    path: P;
  },
>(
  params: Parameters<typeof createRoute<P, R>>[0],
) => {
  return createRoute({
    ...params,
    responses: {
      400: errorResponse("Bad request"),
      401: errorResponse("Unauthorized"),
      403: errorResponse("Forbidden"),
      404: errorResponse("Not found"),
      409: errorResponse("Conflict"),
      500: errorResponse("Internal Server Error"),
      ...params.responses,
    },
  });
};
