import authRoute from "@api/modules/auth/routes";
import employeeRoute from "@api/modules/employee/routes";
import userRoute from "@api/modules/user/routes";
import { OpenAPIHono } from "@hono/zod-openapi";

const routes = new OpenAPIHono()
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/user", userRoute)
  .route("/employee", employeeRoute);

export default routes;
