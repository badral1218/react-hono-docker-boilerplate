import { OpenAPIHono } from "@hono/zod-openapi";
import getUsers from "./get";

const route = new OpenAPIHono().route("/", getUsers);
export default route;
