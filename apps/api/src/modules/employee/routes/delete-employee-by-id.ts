import { OpenApiTags } from "@api/constants";
import { getCommonResponseType } from "@api/utils/common/get-common-response-type";
import { createRouteWithDefaults } from "@api/utils/hono/openapi/createRoute";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "@react-template/db";

const deleteParamsSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
  }),
});

const openAPIDefinition = createRouteWithDefaults({
  method: "delete",
  path: "/{id}",
  request: {
    params: deleteParamsSchema,
  },
  responses: getCommonResponseType("delete employee"),
  tags: [OpenApiTags.EMPLOYEE],
});

const route = new OpenAPIHono().openapi(openAPIDefinition, async (c) => {
  const { id } = c.req.valid("param");

  await prisma.employee.delete({ where: { id: +id } });

  return c.json({ success: true, message: "successfully deleted" });
});

export default route;
