/*
  Warnings:

  - Made the column `turn` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "turn" SET NOT NULL;
