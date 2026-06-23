import { z } from "zod";

export const RoleSchema = z.enum(["WORKER", "ADMIN"]);

export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  role: RoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type User = z.infer<typeof UserSchema>;
