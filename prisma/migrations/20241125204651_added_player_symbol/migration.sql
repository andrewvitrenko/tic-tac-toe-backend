/*
  Warnings:

  - A unique constraint covering the columns `[gameId,userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sybmol` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "sybmol" "CellValue" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_userId_key" ON "Player"("gameId", "userId");
