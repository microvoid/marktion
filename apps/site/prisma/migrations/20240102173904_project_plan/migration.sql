/*
  Warnings:

  - You are about to drop the column `usage` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `Project` table. All the data in the column will be lost.
  - You are about to alter the column `plan` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `usage`,
    DROP COLUMN `usageLimit`,
    ADD COLUMN `aiChatLimit` INTEGER NOT NULL DEFAULT 20,
    ADD COLUMN `planComment` VARCHAR(191) NULL,
    ADD COLUMN `sizeLimit` INTEGER NOT NULL DEFAULT 1048576,
    MODIFY `plan` ENUM('Custom', 'Free', 'Pro') NOT NULL DEFAULT 'Free';
