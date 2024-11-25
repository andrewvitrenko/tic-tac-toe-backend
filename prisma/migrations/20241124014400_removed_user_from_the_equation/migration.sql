/*
  Warnings:

  - You are about to drop the column `userId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[socketId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socketId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropIndex
DROP INDEX "Player_userId_gameId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "userId",
ADD COLUMN     "socketId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Player_socketId_key" ON "Player"("socketId");
