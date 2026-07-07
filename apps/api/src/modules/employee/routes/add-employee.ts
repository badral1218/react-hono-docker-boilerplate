import { OpenApiTags } from "@api/constants";
import { getCommonResponseType } from "@api/utils/common/get-common-response-type";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";

const bodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  position: z.string(),
  birthday: z.string(),
  email: z.string(),
  order: z.number(),
});

const openAPIDefinition = createRouteWithDefaults({
  path: "/add",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: bodySchema,
        },
      },
      required: true,
    },
  },
  responses: getCommonResponseType("add employee"),
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  try {
    const body = c.req.valid("json");

    await prisma.employee.create({ data: { ...body } });

    return c.json({ success: true, message: "successfully added" });
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export default route;
