-- CreateTable
CREATE TABLE "waitlist_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_email_key" ON "waitlist_users"("email");

-- CreateIndex
CREATE INDEX "waitlist_users_createdAt_idx" ON "waitlist_users"("createdAt");

-- CreateIndex
CREATE INDEX "waitlist_users_email_idx" ON "waitlist_users"("email");

-- Trigger to update updatedAt on record changes
CREATE TRIGGER update_waitlist_users_updatedAt
    AFTER UPDATE ON "waitlist_users"
    FOR EACH ROW
    BEGIN
        UPDATE "waitlist_users" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;