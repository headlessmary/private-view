BEGIN;

CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "legacyEventTime" TEXT,
    "imageUrl" TEXT,
    "maxCapacity" INTEGER NOT NULL,
    "earlyBirdPrice" INTEGER,
    "saintsRebelsPrice" INTEGER,
    "fiveFriendsPrice" INTEGER,
    "vipPrice" INTEGER,
    "regularPrice" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isHistorical" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_published_endDateTime_idx"
    ON "Event"("published", "endDateTime");

ALTER TABLE "Attendee" ADD COLUMN "eventId" TEXT;

INSERT INTO "Event" (
    "id",
    "eventName",
    "slug",
    "venue",
    "legacyEventTime",
    "maxCapacity",
    "vipPrice",
    "regularPrice",
    "published",
    "isHistorical",
    "createdAt",
    "updatedAt"
)
VALUES (
    'private-view',
    'The Private View',
    'private-view',
    'Asaba, Delta State',
    '20:00',
    60,
    70000,
    55000,
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "Event" (
    "id",
    "eventName",
    "slug",
    "venue",
    "startDateTime",
    "endDateTime",
    "maxCapacity",
    "earlyBirdPrice",
    "saintsRebelsPrice",
    "fiveFriendsPrice",
    "published",
    "isHistorical",
    "createdAt",
    "updatedAt"
)
SELECT
    'headless-society',
    COALESCE(config."eventName", 'Headless Society'),
    'headless-society',
    COALESCE(config."venue", 'Five Friends, Asaba'),
    (
        COALESCE(
            config."eventDateTime"::TIMESTAMP,
            TIMESTAMP '2026-10-29 21:00:00'
        )
        AT TIME ZONE 'Africa/Lagos'
    ) AT TIME ZONE 'UTC',
    TIMESTAMP '2026-10-30 11:00:00',
    COALESCE(config."maxCapacity", 60),
    COALESCE(config."earlyBirdPrice", 10000),
    COALESCE(config."saintsRebelsPrice", 15000),
    COALESCE(config."fiveFriendsPrice", 40000),
    true,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (SELECT 1) AS seed
LEFT JOIN "EventConfig" AS config ON config."id" = 'active';

UPDATE "Attendee"
SET "eventId" = CASE
    WHEN "ticketType"::TEXT IN ('VIP', 'REGULAR')
        THEN 'private-view'
    WHEN "ticketType"::TEXT IN (
        'EARLY_BIRD',
        'SAINTS_REBELS',
        'FIVE_FRIENDS'
    )
        THEN 'headless-society'
    ELSE NULL
END
WHERE "eventId" IS NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Attendee"
        WHERE "eventId" IS NULL
    ) THEN
        RAISE EXCEPTION
            'Event backfill incomplete; Attendee.eventId contains NULL rows.';
    END IF;
END $$;

ALTER TABLE "Attendee" ALTER COLUMN "eventId" SET NOT NULL;
CREATE INDEX "Attendee_eventId_idx" ON "Attendee"("eventId");

ALTER TABLE "Attendee"
    ADD CONSTRAINT "Attendee_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE "EventConfig";

COMMIT;
