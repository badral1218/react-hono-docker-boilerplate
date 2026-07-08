import { OpenApiTags } from "@api/constants";
import { getCommonResponseType } from "@api/utils/common/get-common-response-type";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";
import { z } from "zod";

const openAPIDefinition = createRouteWithDefaults({
  path: "/update",
  method: "put",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              id: z.string(),
              order: z.string(),
            }),
          ),
        },
      },
      required: true,
    },
  },
  responses: getCommonResponseType("update orders"),
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  try {
    const data = c.req.valid("json");

    await prisma.$transaction(
      data.map(({ id, order }) =>
        prisma.employee.update({
          where: { id: Number(id) },
          data: {
            order: Number(order) + 1,
          },
        }),
      ),
    );

    return c.json({ success: true, message: "Successfully updated" });
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export default route;
