import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaClient: PrismaClient | null = null;

try {
  prismaClient = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaClient;
  }
} catch (error) {
  // Prisma client may not be generated yet if `prisma generate` has not been run
  console.warn('PrismaClient not yet initialized. Falling back to in-memory database provider.');
  prismaClient = null;
}

export const prisma = prismaClient;
export default prisma;
