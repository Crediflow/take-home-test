import { cookies } from "next/headers";
import { db } from "./db";

export const SESSION_COOKIE = "session_user_id";

export async function createContext() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionUserId) {
    return { user: null, organization: null, db };
  }

  const user = await db.user.findUnique({
    where: { id: sessionUserId },
    include: {
      memberships: { include: { organization: true }, take: 1 },
    },
  });

  if (!user) {
    return { user: null, organization: null, db };
  }

  const activeMembership = user.memberships[0] ?? null;

  return {
    db,
    user: { id: user.id, name: user.name, email: user.email },
    organization: activeMembership
      ? {
          id: activeMembership.organization.id,
          name: activeMembership.organization.name,
        }
      : null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
