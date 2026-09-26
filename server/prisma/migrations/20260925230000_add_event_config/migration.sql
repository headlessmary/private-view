CREATE TABLE "EventConfig" (
    "id" TEXT NOT NULL DEFAULT 'active',
    "eventName" TEXT NOT NULL DEFAULT 'Headless Society',
    "venue" TEXT NOT NULL DEFAULT 'Five Friends, Asaba',
    "eventDateTime" TEXT NOT NULL DEFAULT '2026-10-29T21:00',
    "maxCapacity" INTEGER NOT NULL DEFAULT 60,
    "earlyBirdPrice" INTEGER NOT NULL DEFAULT 10000,
    "saintsRebelsPrice" INTEGER NOT NULL DEFAULT 15000,
    "fiveFriendsPrice" INTEGER NOT NULL DEFAULT 40000,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventConfig_pkey" PRIMARY KEY ("id")
);
