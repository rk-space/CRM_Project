-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "expectedClose" TIMESTAMP(3),
ADD COLUMN     "ownerId" TEXT;
