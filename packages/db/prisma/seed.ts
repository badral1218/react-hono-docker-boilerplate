import { prisma } from "../src/index";

const SEED_PASSWORD = "1234";

const users = [
  { email: "admin@nashatech.com", name: "admin", role: "ADMIN" as const },
  { email: "user1@nashatech.com", name: "user1", role: "WORKER" as const },
  { email: "user2@nashatech.com", name: "user2", role: "WORKER" as const },
];

const passwordHash = await Bun.password.hash(SEED_PASSWORD);

for (const user of users) {
  await prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name, role: user.role },
    create: { ...user, passwordHash },
  });
}

console.log(`Seeded ${users.length} users (password: ${SEED_PASSWORD})`);

await prisma.$disconnect();
