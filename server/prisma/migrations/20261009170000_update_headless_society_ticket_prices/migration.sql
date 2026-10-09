BEGIN;

UPDATE "Event"
SET
    "earlyBirdPrice" = 15000,
    "saintsRebelsPrice" = 20000,
    "fiveFriendsPrice" = 40000,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'headless-society';

COMMIT;
