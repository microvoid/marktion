-- AlterTable
ALTER TABLE `ProjectPlan` ADD COLUMN `cdkey` VARCHAR(191) NULL,
    MODIFY `payMethod` ENUM('Weixin', 'Alipay', 'CDkey') NOT NULL DEFAULT 'CDkey',
    MODIFY `period` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
    MODIFY `periodCount` INTEGER NOT NULL DEFAULT 1,
    MODIFY `projectId` VARCHAR(191) NULL;
