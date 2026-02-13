/*
  Warnings:

  - You are about to drop the column `repeats` on the `Exercise` table. All the data in the column will be lost.
  - The primary key for the `PlanExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moveId` on the `PlanExercise` table. All the data in the column will be lost.
  - Added the required column `exerciseId` to the `PlanExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- DropForeignKey
ALTER TABLE "PlanExercise" DROP CONSTRAINT "PlanExercise_moveId_fkey";

-- DropIndex
DROP INDEX "PlanExercise_planId_moveId_idx";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "repeats";

-- AlterTable
ALTER TABLE "PlanExercise" DROP CONSTRAINT "PlanExercise_pkey",
DROP COLUMN "moveId",
ADD COLUMN     "exerciseId" INTEGER NOT NULL,
ADD CONSTRAINT "PlanExercise_pkey" PRIMARY KEY ("planId", "exerciseId");

-- CreateIndex
CREATE INDEX "PlanExercise_planId_exerciseId_idx" ON "PlanExercise"("planId", "exerciseId");

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
