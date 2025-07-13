// lib/prisma.ts (or src/lib/prisma.ts if you prefer src directory)
import { PrismaClient } from '@/generated/prisma';

// This is necessary to prevent multiple instances of Prisma Client in development.
// See: https://www.prisma.io/docs/guides/other/troubleshooting-connections/help-articles/nextjs-prisma-client-best-practices
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: logs all database queries to the console
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}