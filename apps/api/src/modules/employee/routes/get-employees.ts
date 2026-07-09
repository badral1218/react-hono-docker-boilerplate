import { OpenApiTags } from "@api/constants";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";

const openAPIDefinition = createRouteWithDefaults({
  path: "/",
  method: "get",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            employees: z.array(
              z.object({
                id: z.number(),
                email: z.string(),
                firstName: z.string(),
                lastName: z.string(),
                birthdate: z.string(),
                order: z.number().nullable(),
                position: z.string(),
                department: z.string(),
                phoneNumber: z.string(),
              }),
            ),
          }),
        },
      },
      description: "Employees list",
    },
  },
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  const employees = await prisma.employee.findMany({
    orderBy: { order: "asc" },
  });
  return c.json({ employees }, 200);
});

export default route;
