/*
  Warnings:

  - You are about to drop the column `birthday` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `department` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "birthday",
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
