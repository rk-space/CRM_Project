-- CreateTable
CREATE TABLE "Lead" (
    "lead_id" TEXT NOT NULL,
    "lead_source" TEXT,
    "lead_status" TEXT NOT NULL DEFAULT 'New',
    "lead_score" INTEGER NOT NULL DEFAULT 0,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "alternate_phone" TEXT,
    "company_name" TEXT,
    "industry" TEXT,
    "annual_revenue" DOUBLE PRECISION,
    "number_of_employees" INTEGER,
    "designation" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "assigned_to" TEXT,
    "campaign_id" TEXT,
    "tags" TEXT,
    "remarks" TEXT,
    "company_id" TEXT,
    "branch_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("lead_id")
);

-- CreateTable
CREATE TABLE "LeadTimeline" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_key" ON "Lead"("phone");

-- AddForeignKey
ALTER TABLE "LeadTimeline" ADD CONSTRAINT "LeadTimeline_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;
