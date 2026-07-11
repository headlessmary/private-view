-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('VIP', 'REGULAR');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "ticketType" "TicketType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "qrCode" TEXT,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_reference_key" ON "Attendee"("reference");
