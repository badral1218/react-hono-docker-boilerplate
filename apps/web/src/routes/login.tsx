import { SignInSchema } from "@react-template/schemas";
import { createFileRoute, isRedirect, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { authQuery, useLogin } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery(authQuery);
      throw redirect({ to: "/users" });
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = SignInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      });
      return;
    }
    setFieldErrors({});

    try {
      await login(parsed.data);
      await navigate({ to: "/users" });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">
          Use a seeded account, e.g. alice@example.com / password123
        </p>

        <div className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            placeholder="you@company.com"
          />
          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            placeholder="••••••••"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
