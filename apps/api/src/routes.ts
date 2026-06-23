import authRoute from "@api/modules/auth/routes";
import userRoute from "@api/modules/user/routes";
import { OpenAPIHono } from "@hono/zod-openapi";

const routes = new OpenAPIHono()
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/user", userRoute);

export default routes;
