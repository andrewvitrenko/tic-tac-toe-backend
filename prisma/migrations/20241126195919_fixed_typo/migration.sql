/*
  Warnings:

  - You are about to drop the column `sybmol` on the `Player` table. All the data in the column will be lost.
  - Added the required column `symbol` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "sybmol",
ADD COLUMN     "symbol" "CellValue" NOT NULL;
