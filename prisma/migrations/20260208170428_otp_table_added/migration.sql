-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('RESET_PASSWORD', 'CREATE_ACCOUNT');

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OTPType" NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OTP_phone_idx" ON "OTP"("phone");
