/*
  Warnings:

  - You are about to drop the column `updated_at` on the `check_in` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "check_in" DROP COLUMN "updated_at",
ADD COLUMN     "validated_at" TIMESTAMP(3);
