/*
  Warnings:

  - Added the required column `company_id` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_lead_id_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "company_id" TEXT NOT NULL,
ALTER COLUMN "lead_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "account_id" TEXT,
ADD COLUMN     "branch_id" TEXT;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("lead_id") ON DELETE SET NULL ON UPDATE CASCADE;
