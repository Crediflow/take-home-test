import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const acme = await db.organization.upsert({
    where: { id: "org_acme" },
    update: { name: "Acme Capital" },
    create: { id: "org_acme", name: "Acme Capital" },
  });

  const beta = await db.organization.upsert({
    where: { id: "org_beta" },
    update: { name: "Beta Lending" },
    create: { id: "org_beta", name: "Beta Lending" },
  });

  const users = [
    { id: "user_alice", email: "alice@acme.test", name: "Alice (Acme)", orgId: acme.id },
    { id: "user_bob", email: "bob@acme.test", name: "Bob (Acme)", orgId: acme.id },
    { id: "user_carol", email: "carol@beta.test", name: "Carol (Beta)", orgId: beta.id },
    { id: "user_dave", email: "dave@beta.test", name: "Dave (Beta)", orgId: beta.id },
  ];

  for (const u of users) {
    await db.user.upsert({
      where: { id: u.id },
      update: { email: u.email, name: u.name },
      create: { id: u.id, email: u.email, name: u.name },
    });
    await db.membership.upsert({
      where: { userId_organizationId: { userId: u.id, organizationId: u.orgId } },
      update: {},
      create: { userId: u.id, organizationId: u.orgId },
    });
  }

  console.log(`Seeded ${users.length} users across 2 orgs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
