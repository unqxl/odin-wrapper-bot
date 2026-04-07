/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `setup` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_userId_key` ON `users`(`userId`);
