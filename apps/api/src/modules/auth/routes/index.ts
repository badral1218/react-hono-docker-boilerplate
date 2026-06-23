import { OpenAPIHono } from "@hono/zod-openapi";
import me from "./me";
import signin from "./signin";
import signout from "./signout";

const route = new OpenAPIHono().route("/", signin).route("/", me).route("/", signout);

export default route;
