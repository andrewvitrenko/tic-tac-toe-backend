/*
  Warnings:

  - A unique constraint covering the columns `[gameId,symbol]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId,name]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_symbol_key" ON "Player"("gameId", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_name_key" ON "Player"("gameId", "name");
