/*
  Warnings:

  - The values [CREATE_ACCOUNT] on the enum `OTPType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phone,type]` on the table `OTP` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OTPType_new" AS ENUM ('RESET_PASSWORD', 'REGISTER');
ALTER TABLE "OTP" ALTER COLUMN "type" TYPE "OTPType_new" USING ("type"::text::"OTPType_new");
ALTER TYPE "OTPType" RENAME TO "OTPType_old";
ALTER TYPE "OTPType_new" RENAME TO "OTPType";
DROP TYPE "public"."OTPType_old";
COMMIT;

-- DropIndex
DROP INDEX "OTP_phone_key";

-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OTP_phone_type_key" ON "OTP"("phone", "type");
