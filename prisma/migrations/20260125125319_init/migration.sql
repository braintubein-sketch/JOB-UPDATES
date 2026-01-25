-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "postName" TEXT NOT NULL,
    "vacancies" TEXT,
    "qualification" TEXT NOT NULL,
    "ageLimit" TEXT,
    "salary" TEXT,
    "importantDates" TEXT,
    "selectionProcess" TEXT,
    "applicationFee" TEXT,
    "notificationLink" TEXT,
    "applyLink" TEXT,
    "faq" TEXT,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "state" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
