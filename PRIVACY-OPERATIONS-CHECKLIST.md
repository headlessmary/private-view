# Privacy operations checklist

This is an internal implementation checklist, not a public privacy notice.
Do not publish assumptions as facts. Record decisions and provider evidence
before updating the policy.

## Production setup

- [ ] Configure `VITE_API_URL` with the actual backend URL when frontend and
  backend are on different origins.
- [ ] Configure `CORS_ALLOWED_ORIGINS` with the exact production frontend
  origin(s). Production backend startup intentionally fails when the list is
  empty.
- [ ] Configure `FLW_SECRET_KEY` and `FLW_WEBHOOK_SECRET` as backend-only
  secrets. Never use `VITE_` variables for payment or server credentials.
- [ ] Verify and rotate any Flutterwave credential that was previously
  committed or otherwise exposed. Rotation is not performed by this change.
- [ ] Confirm the actual frontend host, backend host, PostgreSQL provider and
  regions, backup locations, and provider data-processing terms.
- [ ] Confirm database and backup encryption, transport security, access
  restrictions, recovery controls, and security incident procedures with the
  relevant providers.
- [ ] Confirm the production Brevo account, its data-processing terms,
  processing locations, and retention settings.
- [ ] Confirm Google Analytics configuration, cookies, data retention,
  processing locations, and applicable consent requirements. Verify that
  analytics does not receive personal information in page parameters.
- [ ] Decide whether to continue loading typefaces from Google Fonts or
  self-host them, and confirm the applicable disclosure and transfer details.

## Data access and sharing

- [ ] Decide which staff and event organizers may access attendee data, which
  fields they need, and whether access is direct in the admin dashboard or
  provided by exports.
- [ ] The current application has a single authenticated admin model and no
  event-organizer role or event-scoped admin permissions. Decide whether this
  is appropriate before granting organizer access.
- [ ] Document data-sharing terms and safeguards with organizers and service
  providers. Confirm any international-transfer safeguards that apply.
- [ ] Review who can access administrator credentials and how access is
  provisioned, reviewed, and revoked.

## Retention and deletion decisions

The application does not implement automatic attendee deletion or a customer
self-service deletion endpoint. Agree retention and handling for each
category before implementing deletion:

- [ ] **Ticket/order records:** attendee identity and contact fields, event,
  ticket type, order amount, booking reference, and pending/success/failed
  status. Approve periods for incomplete, cancelled, failed, and successful
  orders.
- [ ] **Payment/accounting records:** payment method, transaction/payment
  references, amount, confirmation metadata, and manual-payment notes. Confirm
  applicable accounting, tax, dispute, and payment-provider requirements
  before deleting or anonymising.
- [ ] **Ticket access and attendance:** QR token, QR URL, one-time-use state,
  and check-in status. Decide when tokens can be invalidated and when
  attendance records can be removed without affecting ticket support or
  disputes.
- [ ] **Support and administrator notes:** identify where support requests
  are stored and set a separate retention period. The current attendee schema
  includes `adminNotes`.
- [ ] **Technical, email, analytics, and backups:** identify provider logs,
  email delivery records, analytics retention, database backups, and backup
  expiry; agree deletion propagation and exceptions.
- [ ] Define a verified privacy-request workflow for access, correction,
  deletion, restriction, and objection requests. Identify an authorised
  reviewer, identity-verification method, response tracking, and documented
  exceptions for records that must be retained.

## Business and legal details

- [ ] Replace the publication-date placeholder in the privacy notice after
  the final notice and practices have been reviewed.
- [ ] Confirm the business identity and whether a postal/business address
  should appear in the notice.
- [ ] Determine whether a Data Protection Officer or other designated privacy
  contact is required and, if so, publish the correct contact.
- [ ] Confirm the applicable lawful basis and notice for each processing
  purpose, including ticket fulfilment, event entry, and optional analytics.
- [ ] Confirm whether events admit children and any age, guardian, or consent
  process that applies.
- [ ] Confirm whether data is used for advertising, profiling, or any purpose
  beyond ticket administration, support, event entry, legal duties, and
  consented analytics.
- [ ] Have the final notice and operational practices reviewed for applicable
  Nigerian data-protection requirements. No compliance determination is made
  by this checklist.
