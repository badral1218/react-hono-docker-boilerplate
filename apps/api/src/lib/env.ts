import { z } from "zod";

const Env = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BACK_PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().url(),
});

const result = Env.safeParse(process.env);
if (!result.success) {
  console.error(
    "Invalid environment configuration. The following variables are missing or invalid:",
  );
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;
export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";
