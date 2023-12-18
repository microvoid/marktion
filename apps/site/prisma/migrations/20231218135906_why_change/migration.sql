/*
  Warnings:

  - Added the required column `url` to the `File` table without a default value. This is not possible if the table is not empty.
  - Made the column `uploader` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `url` VARCHAR(191) NOT NULL,
    MODIFY `uploader` ENUM('cloudflareR2') NOT NULL DEFAULT 'cloudflareR2';
