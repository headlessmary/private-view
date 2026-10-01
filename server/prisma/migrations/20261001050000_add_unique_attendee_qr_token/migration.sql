BEGIN;

CREATE UNIQUE INDEX "Attendee_qrToken_key"
    ON "Attendee"("qrToken");

COMMIT;
