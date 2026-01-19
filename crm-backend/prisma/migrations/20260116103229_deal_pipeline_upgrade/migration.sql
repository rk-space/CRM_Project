/*
  Warnings:

  - Added the required column `company_id` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "branch_id" TEXT,
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "expected_close_date" TIMESTAMP(3),
ADD COLUMN     "probability" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'Qualification';
