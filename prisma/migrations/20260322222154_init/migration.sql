/*
  Warnings:

  - You are about to drop the column `duration_ms` on the `AgentRun` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `AgentRun` table. All the data in the column will be lost.
  - You are about to drop the column `input` on the `AgentRun` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `processed_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `OnboardingGuide` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `AgentRun` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgentRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_id" INTEGER NOT NULL,
    "agent_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "output" TEXT,
    "error_message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "AgentRun_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AgentRun" ("agent_name", "created_at", "event_id", "id", "output", "status") SELECT "agent_name", "created_at", "event_id", "id", "output", "status" FROM "AgentRun";
DROP TABLE "AgentRun";
ALTER TABLE "new_AgentRun" RENAME TO "AgentRun";
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_type" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("created_at", "event_type", "id", "payload", "project_id", "status") SELECT "created_at", "event_type", "id", "payload", "project_id", "status" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_OnboardingGuide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" INTEGER NOT NULL,
    "guide_content" TEXT NOT NULL,
    "starter_issues" TEXT NOT NULL,
    "gitlab_issue_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OnboardingGuide" ("created_at", "gitlab_issue_url", "guide_content", "id", "project_id", "starter_issues") SELECT "created_at", "gitlab_issue_url", "guide_content", "id", "project_id", "starter_issues" FROM "OnboardingGuide";
DROP TABLE "OnboardingGuide";
ALTER TABLE "new_OnboardingGuide" RENAME TO "OnboardingGuide";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
