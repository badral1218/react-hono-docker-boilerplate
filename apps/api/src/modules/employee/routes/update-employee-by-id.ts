import { OpenApiTags } from "@api/constants";
import { getCommonResponseType } from "@api/utils/common/get-common-response-type";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";

const updateParamsSchema = z.object({
  id: z.string().openapi({
    param: { name: "id" },
  }),
});

const bodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  position: z.string(),
  department: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  order: z.number(),
});

const openAPIDefinition = createRouteWithDefaults({
  method: "put",
  path: "/{id}",
  request: {
    params: updateParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: bodySchema,
        },
      },
      required: true,
    },
  },
  responses: getCommonResponseType("Update Employee"),
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  const body = c.req.valid("json");

  const { id } = c.req.valid("param");

  await prisma.employee.update({
    where: {
      id: +id,
    },
    data: { ...body },
  });

  return c.json({ success: true, message: "Successfully updated" });
});

export default route;
