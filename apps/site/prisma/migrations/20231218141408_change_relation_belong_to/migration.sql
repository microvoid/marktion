-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SentEmail` DROP FOREIGN KEY `SentEmail_userId_fkey`;

-- AlterTable
ALTER TABLE `Tag` ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `projectId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SentEmail` ADD CONSTRAINT `SentEmail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
