/*
  Warnings:

  - You are about to drop the column `winId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_winId_fkey";

-- DropIndex
DROP INDEX "Player_winId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "winId";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
