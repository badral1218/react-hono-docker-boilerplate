import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type SignIn = z.infer<typeof SignInSchema>;
