ALTER TABLE "Attendee"
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "confirmedBy" TEXT,
ADD COLUMN "confirmedAt" TIMESTAMP(3),
ADD COLUMN "paymentReference" TEXT,
ADD COLUMN "adminNotes" TEXT;
