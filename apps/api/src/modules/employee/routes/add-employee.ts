import { OpenApiTags } from "@api/constants";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";

const bodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  birthdate: z.string(),
  position: z.string(),
  email: z.string(),
  order: z.number(),
  department: z.string(),
  phoneNumber: z.string(),
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
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.object({
              firstName: z.string(),
              lastName: z.string(),
              birthdate: z.string(),
              position: z.string(),
              email: z.string(),
              order: z.number().nullable(),
              id: z.number(),
            }),
          }),
        },
      },
      description: "Add Employee",
    },
  },
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  try {
    const body = c.req.valid("json");

    const createdData = await prisma.employee.create({ data: { ...body } });

    return c.json({ data: createdData }, 200);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export default route;
