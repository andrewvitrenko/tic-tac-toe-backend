/*
  Warnings:

  - Made the column `value` on table `Cell` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cell" ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "value" SET DEFAULT 'EMPTY';
