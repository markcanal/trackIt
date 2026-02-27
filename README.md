# TrackIt 💸

A personal cashflow tracking web app built with SvelteKit, Better Auth, Drizzle ORM, and Neon Postgres. Available as a PWA and paired with a Kotlin Multiplatform Android app.

**Live:** https://trackit-production-ec11.up.railway.app

---

## Features

- **Authentication** — Email/password, Google OAuth, Magic Link, Anonymous login via Better Auth
- **Income tracking** — Add, edit, delete, filter by date/category, export to CSV
- **Expense tracking** — Add, edit, delete, filter by date/category, export to CSV
- **Scheduled payments** — Recurring expenses with frequency, toggle active/inactive
- **Dashboard** — Balance overview, 6-month bar chart, upcoming scheduled payments
- **Push notifications** — FCM-powered reminders for upcoming scheduled payments
- **REST API** — Firebase-authenticated endpoints for the mobile app
- **PWA** — Installable on mobile/desktop, offline-capable with service worker
- **Dark mode** — System preference detection with localStorage persistence

---

## Tech Stack

| Layer       | Technology             |
| ----------- | ---------------------- |
| Framework   | SvelteKit 2 + Svelte 5 |
| Language    | TypeScript             |
| Styling     | Tailwind CSS v4        |
| Auth        | Better Auth            |
| ORM         | Drizzle ORM            |
| Database    | Neon (Postgres)        |
| Mobile Auth | Firebase Admin SDK     |
| Deployment  | Railway                |
| Charts      | Chart.js               |

---

## Project Structure

```
sv-cashflow/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts              # Better Auth config
│   │   │   ├── firebase-admin.ts    # Firebase Admin + token verification
│   │   │   ├── notifications.ts     # FCM notification sender
│   │   │   └── db/
│   │   │       ├── index.ts         # Drizzle DB instance
│   │   │       ├── schema.ts        # Income/Expense/Scheduled tables
│   │   │       └── auth.schema.ts   # Better Auth tables
│   │   ├── auth/
│   │   │   └── auth-client.ts       # Better Auth client
│   │   └── stores/
│   │       └── theme.ts             # Dark mode store
│   ├── routes/
│   │   ├── auth/                    # Login/register page
│   │   ├── (app)/                   # Protected routes
│   │   │   ├── dashboard/           # Dashboard + chart
│   │   │   ├── income/              # Income CRUD
│   │   │   ├── expenses/            # Expenses CRUD
│   │   │   ├── scheduled/           # Scheduled payments
│   │   │   ├── profile/             # User profile
│   │   │   └── export/              # CSV export endpoint
│   │   └── api/
│   │       ├── v1/                  # REST API for mobile app
│   │       │   ├── income/
│   │       │   ├── expenses/
│   │       │   ├── scheduled/
│   │       │   └── fcm-token/       # FCM token registration
│   │       └── cron/
│   │           └── notify/          # Push notification cron endpoint
│   ├── app.html
│   ├── app.css
│   └── hooks.server.ts              # Better Auth handler
├── static/
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service worker
│   ├── icon-192.png
│   └── icon-512.png
├── drizzle/                         # DB migrations
├── railway.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local Postgres) or a Neon account
- Firebase project (for Google OAuth + mobile API auth)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/trackit.git
cd trackit
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
# App
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:5173
VITE_BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=your-32-char-secret

# Database (local Docker or Neon)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trackit

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase Admin (from Firebase Console > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# Cron job protection
CRON_SECRET=your-random-cron-secret
```

### 3. Start local Postgres (optional)

```bash
docker run --name trackit-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trackit \
  -p 5432:5432 \
  -d postgres
```

### 4. Push database schema

```bash
npx drizzle-kit push
```

### 5. Start dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## REST API

The API is used by the TrackIt Android app. All endpoints require a Firebase ID token in the `Authorization` header.

```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

| Method | Endpoint                | Description                                         |
| ------ | ----------------------- | --------------------------------------------------- |
| GET    | `/api/v1/income`        | Get all income                                      |
| POST   | `/api/v1/income`        | Add income                                          |
| PATCH  | `/api/v1/income?id=`    | Edit income                                         |
| DELETE | `/api/v1/income?id=`    | Delete income                                       |
| GET    | `/api/v1/expenses`      | Get all expenses                                    |
| POST   | `/api/v1/expenses`      | Add expense                                         |
| PATCH  | `/api/v1/expenses?id=`  | Edit expense                                        |
| DELETE | `/api/v1/expenses?id=`  | Delete expense                                      |
| GET    | `/api/v1/scheduled`     | Get scheduled payments                              |
| POST   | `/api/v1/scheduled`     | Add scheduled payment                               |
| PATCH  | `/api/v1/scheduled?id=` | Edit/toggle scheduled                               |
| DELETE | `/api/v1/scheduled?id=` | Delete scheduled                                    |
| POST   | `/api/v1/fcm-token`     | Register FCM token                                  |
| GET    | `/api/cron/notify`      | Trigger push notifications (requires `CRON_SECRET`) |

### User Linking

Firebase Auth users are automatically linked to Better Auth users by email. This means data created on the web app is accessible on the mobile app with the same email account.

---

## Deployment

### Railway

1. Push to GitHub — Railway auto-deploys on push
2. Set all environment variables in Railway dashboard
3. The build command runs `vite build && drizzle-kit push` to migrate the DB automatically

**Required Railway environment variables:**

```
NODE_ENV=production
DATABASE_URL=
BETTER_AUTH_URL=https://your-app.up.railway.app
VITE_BETTER_AUTH_URL=https://your-app.up.railway.app
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
CRON_SECRET=
PORT=3000
```

### Cron Job (Push Notifications)

A separate Railway service runs daily at 6 AM Philippine time (10 PM UTC) to notify users of upcoming scheduled payments:

```bash
curl -X GET https://your-app.up.railway.app/api/cron/notify \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Database Schema

```
user                  # Better Auth users
session               # Auth sessions
account               # OAuth accounts
income                # Income entries
expenses              # Expense entries
scheduled             # Recurring payments
fcm_tokens            # Mobile push notification tokens
```

---

## Mobile App

The Android app is built with Kotlin Multiplatform + Compose Multiplatform. See the [TrackIt KMP repository](https://github.com/YOUR_USERNAME/trackit-kmp) for setup instructions.

The mobile app:

- Uses Firebase Auth (email/password + Google Sign-In)
- Calls this SvelteKit REST API
- Works offline with SQLDelight local cache
- Syncs automatically when back online

---

## Development Notes

- **Port conflicts** — Vite is configured with `strictPort: true` to always use port `5173`
- **Firebase Admin** — The private key must have literal newlines, not `\n` escape sequences, when set in Railway
- **Better Auth CORS** — `trustedOrigins` in `auth.ts` must include all origins that make API calls
- **CSV Export** — Available at `/export?type=income|expenses|scheduled` for authenticated users

---

## License

MIT
