import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ngohub.com' },
    update: {},
    create: {
      email: 'admin@ngohub.com',
      password,
      role: 'ADMIN',
    },
  });

  const ngoUser = await prisma.user.upsert({
    where: { email: 'ngo@example.com' },
    update: {},
    create: {
      email: 'ngo@example.com',
      password,
      role: 'NGO',
      ngoProfile: {
        create: {
          name: 'Green Earth Foundation',
          location: 'Mumbai',
          isVerified: true
        }
      }
    },
  });

  const volunteer = await prisma.user.upsert({
    where: { email: 'volunteer@example.com' },
    update: {},
    create: {
      email: 'volunteer@example.com',
      password,
      role: 'VOLUNTEER',
      volunteerProfile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          points: 100
        }
      }
    },
  });

  console.log({ admin, ngoUser, volunteer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
