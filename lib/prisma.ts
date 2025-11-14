import { PrismaClient } from '@prisma/client';

// This is a best practice to prevent exhausting the database connection limit
// in development environments.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    // Optional: uncomment to log all queries
    // log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;