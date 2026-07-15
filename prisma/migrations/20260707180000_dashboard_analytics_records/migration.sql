-- CreateTable
CREATE TABLE "DashboardAnalyticsRecord" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "recordKey" TEXT NOT NULL,
    "date" TEXT,
    "month" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardAnalyticsRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardAnalyticsRecord_collection_recordKey_key" ON "DashboardAnalyticsRecord"("collection", "recordKey");

-- CreateIndex
CREATE INDEX "DashboardAnalyticsRecord_collection_idx" ON "DashboardAnalyticsRecord"("collection");

-- CreateIndex
CREATE INDEX "DashboardAnalyticsRecord_collection_date_idx" ON "DashboardAnalyticsRecord"("collection", "date");

-- CreateIndex
CREATE INDEX "DashboardAnalyticsRecord_collection_month_idx" ON "DashboardAnalyticsRecord"("collection", "month");
