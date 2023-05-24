/*
  Warnings:

  - You are about to drop the column `Longitude` on the `gym` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `gym` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gym" DROP COLUMN "Longitude",
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;
