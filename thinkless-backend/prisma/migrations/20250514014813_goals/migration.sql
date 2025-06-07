/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,monthYear]` on the table `Goal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `type` ENUM('INCOME', 'EXPENSE', 'INVESTMENT') NOT NULL,
    ALTER COLUMN `category` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Goal_userId_type_monthYear_key` ON `Goal`(`userId`, `type`, `monthYear`);
