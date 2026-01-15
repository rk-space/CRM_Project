import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    connectionString: process.env.DATABASE_URL,
  },
});

