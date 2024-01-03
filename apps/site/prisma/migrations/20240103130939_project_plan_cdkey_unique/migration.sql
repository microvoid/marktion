/*
  Warnings:

  - A unique constraint covering the columns `[cdkey]` on the table `ProjectPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProjectPlan_cdkey_key` ON `ProjectPlan`(`cdkey`);

-- CreateIndex
CREATE INDEX `ProjectPlan_id_cdkey_idx` ON `ProjectPlan`(`id`, `cdkey`);
