import { createFileRoute, isRedirect, redirect, useNavigate } from "@tanstack/react-router";
import { authQuery, useCurrentUser, useLogout } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { useUpdateEmployeeMutation } from "@/modules/employee/mutations/useEmployeeMutation";
import { useUsersQuery } from "@/modules/user/queries/useUsersQuery";

export const Route = createFileRoute("/users")({
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery(authQuery);
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  },
  component: UsersPage,
});

function UsersPage() {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const { data, isLoading, isError, error } = useUsersQuery();

  const handleLogout = async () => {
    await logout();
    await navigate({ to: "/login" });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
            {currentUser && (
              <p className="mt-2 text-slate-600">
                Signed in as <span className="font-medium text-slate-900">{currentUser.email}</span>{" "}
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
                  {currentUser.role}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>

        {isLoading && <p className="mt-8 text-slate-600">Loading users...</p>}

        {isError && (
          <p className="mt-8 text-red-600">
            {error instanceof Error ? error.message : "Failed to load users"}
          </p>
        )}

        {data && (
          <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {data.users.length === 0 ? (
              <li className="px-4 py-6 text-slate-500">No users found.</li>
            ) : (
              data.users.map((user) => (
                <li key={user.id} className="px-4 py-4">
                  <p className="font-medium text-slate-900">{user.name ?? "Unnamed user"}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </main>
  );
}
