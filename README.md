# Vice Fitting Mallorca

Public site + booking system for Gero Walther, official Vice Golf retailer/fitter on Mallorca.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- shadcn/ui (base-nova) + Lucide icons
- MongoDB Atlas via Mongoose
- Stripe Checkout (€90 / 60 min private fitting at Son Gual)
- Resend for confirmation emails + `.ics` calendar attachments (the booking lands in the customer's calendar with reminders, and a copy is sent to Gero so it shows up in his Mac Calendar too)
- next-intl for DE / EN / ES
- Single-admin auth via env-var password + signed JWT cookie

## Routes

- `/(en|de|es)` — public site (home, fitting, demo-days, products, contact, about, book)
- `/admin` — protected dashboard (bookings list + demo-day CRUD)
- `/api/checkout`, `/api/webhooks/stripe`, `/api/availability`, `/api/admin/*`

## Local setup

```bash
npm install
cp .env.example .env.local       # then fill in real values
npm run dev                      # http://localhost:2020
```

### Required env vars (see `.env.example`)

| Var | Where to get it |
| --- | --- |
| `MONGODB_URI` | Atlas → Connect → Drivers → Node.js |
| `ADMIN_PASSWORD` | Pick anything strong |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | Stripe dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to http://localhost:2020/api/webhooks/stripe` |
| `RESEND_API_KEY` | resend.com → API keys |
| `RESEND_FROM` | A verified sender on Resend |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:2020` for dev, real domain for prod |

### Stripe webhook (local)

In a second terminal:

```bash
stripe listen --forward-to http://localhost:2020/api/webhooks/stripe
```

Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`. Trigger a test purchase from `/en/book` with card `4242 4242 4242 4242`.

## Admin

Open `/admin/login`, enter `ADMIN_PASSWORD`. The session cookie is HTTP-only, JWT-signed, and expires in 12h. The `/admin/*` routes are protected by Next's proxy (formerly middleware).

To rotate: change `ADMIN_PASSWORD` in `.env.local` (or in your host's env). Existing sessions stay valid for 12h unless you also rotate `ADMIN_SESSION_SECRET`, which invalidates them immediately.

## Deploying

1. Push to GitHub, import into Vercel.
2. Add all env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. In MongoDB Atlas → Network Access, add `0.0.0.0/0` (Vercel's IPs rotate).
4. In Stripe → Webhooks, add a production endpoint `https://YOURDOMAIN/api/webhooks/stripe` (events: `checkout.session.completed`, `checkout.session.expired`). Paste the new signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.
5. In Resend, verify the sending domain you picked for `RESEND_FROM`.

## Notes

- Booking slots are defined in `src/lib/constants.ts → DAILY_SLOTS`. Sundays are blocked. Past slots are auto-disabled.
- The DB enforces one paid/pending booking per `startsAt` via a partial unique index — concurrent double-booking attempts get a 409.
- The `vicefitting` MongoDB database is created automatically on first write.
- Online shop is intentionally deferred to phase 2 (pending Vice retailer rules on direct online sales).
