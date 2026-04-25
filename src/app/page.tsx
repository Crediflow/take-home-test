import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { SESSION_COOKIE } from "~/server/context";

async function selectUser(userId: string) {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/");
}

async function signOut() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  const users = await db.user.findMany({
    include: { memberships: { include: { organization: true } } },
    orderBy: { name: "asc" },
  });

  const currentUser = sessionUserId
    ? users.find((u) => u.id === sessionUserId) ?? null
    : null;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Invoice Inbox — Take-Home</h1>
      <p className="mt-2 text-sm text-gray-600">
        Pick a user to simulate a logged-in session.
      </p>

      {currentUser ? (
        <div className="mt-6 rounded border border-gray-200 bg-white p-4">
          <p className="text-sm">
            Signed in as <strong>{currentUser.name}</strong> (
            {currentUser.memberships[0]?.organization.name ?? "no org"})
          </p>
          <div className="mt-3 flex gap-3">
            <a
              href="/invoices"
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to invoices
            </a>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {users.map((user) => (
            <li key={user.id}>
              <form action={selectUser.bind(null, user.id)}>
                <button
                  type="submit"
                  className="w-full rounded border border-gray-200 bg-white p-3 text-left transition hover:border-blue-400"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.email} —{" "}
                    {user.memberships[0]?.organization.name ?? "no org"}
                  </div>
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
