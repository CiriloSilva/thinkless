/*
  Warnings:

  - You are about to drop the column `month` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `goal` table. All the data in the column will be lost.
  - The values [INCOME] on the enum `Goal_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `monthYear` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `goal` DROP COLUMN `month`,
    DROP COLUMN `year`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `monthYear` DATETIME(3) NOT NULL,
    MODIFY `type` ENUM('REVENUE', 'EXPENSE', 'INVESTMENT') NOT NULL;
