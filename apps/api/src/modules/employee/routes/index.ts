import { OpenAPIHono } from "@hono/zod-openapi";
import addEmployee from "./add-employee";
import deleteEmployeeById from "./delete-employee-by-id";
import getEmployees from "./get-employees";
import updateEmployeeById from "./update-employee-by-id";

const route = new OpenAPIHono()
  .route("/", getEmployees)
  .route("/", addEmployee)
  .route("/", deleteEmployeeById)
  .route("/", updateEmployeeById);

export default route;
