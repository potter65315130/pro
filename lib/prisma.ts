import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    // Optional: uncomment to log all queries
    // log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient;

export default prismaClient;
export { prismaClient as prisma }; // เพิ่มบรรทัดนี้