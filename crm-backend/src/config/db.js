const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  adapter: {
    provider: "postgresql",
    url: process.env.DATABASE_URL
  }
});

module.exports = prisma;
