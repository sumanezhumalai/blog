# Newsletter setup (reference: `reference/flavien-bonvin`)

This document explains how the newsletter system works in the reference project at:

- `reference/flavien-bonvin`

It also outlines a concrete plan to recreate the same setup in this blog repo.

## What exists in the reference project

### High-level behavior

The reference implementation is a **double opt-in** newsletter subscription flow:

1. User submits their email on `/newsletter`.
2. The backend sends a **confirmation email** containing a time-limited tokenized link.
3. User clicks the link `/newsletter/validate?token=...`.
4. Backend converts that email into a **confirmed subscriber** by creating a contact in Resend.

Key point: the codebase **does not automatically email subscribers when a new post is published**. It only:

- collects subscribers (as contacts in Resend)
- confirms ownership of emails via the confirmation link

Any “send new posts to subscribers” workflow would be configured separately (manual campaigns in Resend, or automation you build).

---

## Pages and server endpoints

### 1) `/newsletter` (subscription form)

File:

- [newsletter.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter.astro)

Important details:

- `export const prerender = false;` makes it run dynamically (not static HTML).
- Uses an Astro Server Action (`astro:actions`) as the form target:
  - `action={actions.subscribeNewsletter}`
- Reads `Astro.getActionResult(actions.subscribeNewsletter)` to display:
  - success message: “check your inbox to confirm…”
  - input validation errors (zod email)
  - server error message for internal failures

### 2) `/newsletter/validate` (confirmation link handler)

File:

- [validate.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter/validate.astro)

Flow:

- Reads `token` from query string.
- Looks up `uuid:${token}` in Cloudflare KV to find the email.
- If token is missing/invalid/expired → redirects to `/404`.
- If valid → creates a Resend Contact for that email.
- Deletes KV entries (one-time token) and redirects to `/newsletter/validated`.

### 3) `/newsletter/validated` (success landing)

File:

- [validated.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter/validated.astro)

This is a simple “subscription confirmed” page.

---

## Backend implementation (Astro Actions)

### `subscribeNewsletter` action (main subscription logic)

File:

- [actions/index.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/actions/index.ts)

What it does:

1. Validates input with Zod:
   - `email: z.email()`
2. Uses Cloudflare KV (`env.NEWSLETTER_TOKENS`) to prevent duplicate pending confirmations:
   - checks `email:${email}` first
3. Uses Resend to prevent duplicates of already-confirmed subscribers:
   - `resend.contacts.get({ email })`
   - treats `data && !data.unsubscribed` as “already subscribed”
4. Generates a confirmation token:
   - `crypto.randomUUID()`
5. Stores token ↔ email mapping in KV with a 30 minute TTL:
   - `email:${email} -> uuid`
   - `uuid:${uuid} -> email`
6. Sends the confirmation email via Resend.

Error strategy:

- Returns a “conflict” style error for already-subscribed/pending cases.
- Returns a generic internal error for unexpected failures.

---

## Email sending (confirmation email)

### Transactional email sending

File:

- [sendEmail.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/emails/sendEmail.ts)

It sends a single email via:

- `resend.emails.send({ from, to, subject, html })`

### Email HTML template + confirmation URL

File:

- [confirmationTemplate.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/emails/confirmationTemplate.ts)

Important behavior:

- The confirmation link is hard-coded to the production site domain:
  - `https://flavienbonvin.com/newsletter/validate?token=${token}`

Practical implication:

- For your blog, you must generate the link based on your own domain (and ideally not hard-code it).

---

## Storage: where “subscribers” live

### Confirmed subscribers

Confirmed subscribers are stored in **Resend Contacts** (Resend is the system of record for the subscriber list).

- Confirmed means: a contact exists for the email and `unsubscribed: false`.

### Pending confirmations (tokens)

Pending subscriptions are stored temporarily in **Cloudflare KV**, bound as:

- `NEWSLETTER_TOKENS`

Files:

- [wrangler.jsonc](file:///home/suman/Projects/blog/reference/flavien-bonvin/wrangler.jsonc)
- [actions/index.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/actions/index.ts)
- [validate.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter/validate.astro)

KV keys used:

- `email:${email} -> uuid` (prevents re-sending multiple tokens repeatedly)
- `uuid:${uuid} -> email` (used during validation)

TTL:

- 30 minutes

---

## Third-party services / integrations used

### 1) Resend (email provider + contacts)

Used for:

- sending the confirmation email (transactional)
- storing confirmed subscribers as “contacts”

Where it’s used:

- [resend.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/utils/resend.ts)
- [sendEmail.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/emails/sendEmail.ts)
- [actions/index.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/actions/index.ts)
- [validate.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter/validate.astro)

Requirement:

- `RESEND_API_KEY` must be set in the server runtime environment.

### 2) Cloudflare Workers runtime + Cloudflare KV (token storage)

Used for:

- storing time-limited confirmation tokens

Where it’s configured/used:

- [wrangler.jsonc](file:///home/suman/Projects/blog/reference/flavien-bonvin/wrangler.jsonc)
- `env.NEWSLETTER_TOKENS` used in [actions/index.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/actions/index.ts) and [validate.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter/validate.astro)

### 3) Astro Actions (`astro:actions`)

Used for:

- a first-party “form POST → server handler” pattern without a separate API route.

Where it’s used:

- the form action in [newsletter.astro](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/pages/newsletter.astro)
- server handler in [actions/index.ts](file:///home/suman/Projects/blog/reference/flavien-bonvin/src/actions/index.ts)

---

## How email verification / confirmation works (double opt-in)

1. User enters email on `/newsletter`.
2. Backend generates a token (UUID) and stores it in KV with TTL.
3. Backend sends email containing `/newsletter/validate?token=<uuid>`.
4. User clicks the link.
5. Backend checks KV:
   - if token exists, it knows the user controls the inbox
6. Backend “confirms” the subscription by creating a Resend Contact.
7. Backend deletes the token mappings to prevent re-use.

Why this design is used:

- prevents fake subscriptions
- improves deliverability and reduces complaint risk

---

## “Will subscribers get emailed on every new blog post?”

In the reference project: **No, not automatically**.

What exists:

- subscriber capture + confirmation
- a maintained contacts list in Resend

What’s missing (not implemented in code):

- a publishing workflow that detects “new post published” and sends an email to all subscribers

How this is typically set up (options):

1. Manual: write a campaign in Resend UI and send to your audience/contacts.
2. Automated (CI-driven): on publish/merge, a GitHub Action calls a server endpoint/script that:
   - fetches the latest post metadata
   - renders an email template (HTML)
   - sends to the full audience/contact list via Resend
3. Automated (RSS-to-email): use a third-party service that polls your RSS feed and emails subscribers.

If you want true “new post → email all subscribers” automation, it needs additional implementation beyond the reference.

---

## Plan to recreate the same setup in this blog repo (before implementing)

Goal: replicate the **same** architecture and flow as the reference project, adapted to:

- your domain (`https://sumanezhumalai.com`)
- your deployment environment

### Assumptions (based on your current repo)

- This repo is an Astro site with `output: "static"` and no server adapter yet.
- Current “newsletter footer” is a `mailto:` link ([NewsletterCard.astro](file:///home/suman/Projects/blog/src/components/shared/NewsletterCard.astro)), not a real subscription system.

### Step-by-step implementation plan

1. Add server runtime support
   - Install and configure an adapter (most similar to reference: `@astrojs/cloudflare` + Wrangler).
   - Add `wrangler.jsonc` with a KV namespace binding `NEWSLETTER_TOKENS`.

2. Add Resend integration
   - Install `resend`.
   - Add a small Resend client module like the reference (`src/utils/resend.ts`).
   - Configure `RESEND_API_KEY` in Cloudflare (secret).
   - Decide the “from” address (requires Resend domain verification).

3. Add newsletter pages
   - `/newsletter` page (subscription form using Astro Actions).
   - `/newsletter/validate` page (token validation + create contact in Resend).
   - `/newsletter/validated` page (confirmation success message).

4. Add the server action
   - `subscribeNewsletter` action:
     - validate email
     - prevent duplicates (KV + Resend contacts check)
     - store token in KV (TTL 30 min)
     - send confirmation email

5. Update the existing newsletter footer card
   - Replace `mailto:` link with an internal link to `/newsletter`.

6. (Optional) Add “new post to subscribers” automation
   - Not part of the reference flow.
   - Implement only if you want it:
     - define an email template for “new post”
     - decide trigger mechanism (manual/CI/RSS-to-email)

### What I will implement after you confirm “proceed”

- A Cloudflare + KV + Resend powered double opt-in newsletter subscription flow identical to the reference:
  - subscription form page
  - token validation endpoint/page
  - validated success page
  - server action + Resend email + KV token storage
  - footer card updated to link to `/newsletter`

If you also want automatic “email on new article publish”, I will implement it as an explicit second phase because it’s not part of the reference implementation.

