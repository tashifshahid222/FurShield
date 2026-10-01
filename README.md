# FurShield - Pet Care Platform

A full-stack pet care platform that connects pet owners, veterinarians, and shelters. Users can manage pet health records, book appointments, buy products, list pets for adoption, and access care resources.

## Features

- **User Authentication** - Register/login for owners, vets, shelters, and admin (JWT-based, role-based access)
- **Pet Management** - Owners can add, update, and track their pets' profiles and health records
- **Vet Appointments** - Book and manage appointments with veterinarians
- **Products & Store** - Browse pet products, manage cart/orders, product catalog
- **Adoption Listings** - Shelters can list pets for adoption; users can browse and adopt
- **Reviews** - Rate and review veterinarians and products
- **Care Resources** - Articles, FAQs, and videos on pet care
- **Notifications** - In-app notifications for appointments, orders, and messages
- **Contact / Support** - Contact form for user inquiries
- **Dashboards** - Role-specific dashboards for owner, vet, shelter, and admin
- **File Uploads** - Upload pet/product/adoption images via multer

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication + bcryptjs
<<<<<<< HEAD
- Multer 2.x (file uploads)
- express-validator
- helmet (security headers)
- express-rate-limit (brute-force throttling)
=======
- Multer (file uploads)
- express-validator
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

**Frontend**
- React 18 + Vite
- React Router
- Axios
- Custom context API for state management

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tashifshahid222/FurShield.git
   ```

2. **Go to the project folder**
   ```bash
   cd FurShield
   ```

3. **Install dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend (from the project root):
   ```bash
   cd frontend
   npm install
   ```

4. **Set up environment variables**

<<<<<<< HEAD
   Inside the `backend/` folder, create a `.env` file. You can copy `backend/.env.example`:

   ```bash
   cd backend
   cp .env.example .env        # macOS / Linux / Git Bash
   copy .env.example .env      # Windows PowerShell / cmd
   ```

   Then generate a real JWT secret and paste it into `.env`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/furshield
   JWT_SECRET=<paste the generated 96-character secret here>
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
   ```

   > `JWT_SECRET` must be **at least 32 characters** and must not be a placeholder
   > such as `your_secret_key`. The server validates this on startup and **refuses to
   > boot** with a clear message if the secret is missing, too short, or a known
   > placeholder. Copying the `.env.example` placeholders verbatim will not work.

   `CLIENT_ORIGINS` is a comma-separated allowlist of browser origins allowed by CORS.
   If you leave it unset it falls back to the localhost dev ports listed above, and a
   warning is logged in production — always set it explicitly when deploying.

=======
   Inside the `backend/` folder, create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/furshield
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
5. **Run the project**

   Backend (on port 5000):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (on port 5173):
   ```bash
   cd frontend
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

## Seeding the Database (Test Data)

The backend includes a seed script that populates the database with an admin account, a sample veterinarian, a sample shelter, product categories, products, adoption listings, and care content (articles, FAQs, videos). Run it once after your `.env` is set up and MongoDB is running:

```bash
cd backend
node db/seed.js
```

The script is safe to re-run — it skips records that already exist instead of duplicating them.
<<<<<<< HEAD
It **refuses to run when `NODE_ENV=production`** so demo data can never be written to a live
database. Running it always prints a warning about the demo accounts it creates.
=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

### Demo / Test Credentials

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | admin@furshield.com | admin123 | Full access to all admin dashboard modules |
| Veterinarian | vet@furshield.com | vet12345 | Dr. Amanda Wilson, pre-filled profile with availability slots |
| Shelter | shelter@furshield.com | shelter123 | "Happy Paws Shelter", pre-verified, with 2 sample adoption listings |
| Pet Owner | *(none seeded)* | — | Register a new account via the **Register** page and select the "Owner" role |

<<<<<<< HEAD
> **Security note:** These credentials are for local development and evaluation only, and
> they are printed on the login page. Never use them, or the `JWT_SECRET` placeholder, in a
> production deployment.

## Security

A security hardening pass covers input validation, authorization and secret handling.

**Input validation**
- Register / login / password / profile endpoints are validated with `express-validator`
  via `backend/validators/authValidators.js`. Fields must be strings, which also blocks
  NoSQL operator injection such as `{"$gt": ""}`.
- Passwords must be **at least 8 characters** (enforced in the Mongoose schema, the API
  validators, and the Register form).
- `register` rejects `role: "admin"` before creating the account.
- Request bodies and query strings are stripped of `$`-prefixed and dotted keys by
  `middleware/mongoSanitize.js` to prevent NoSQL operator injection.
- Search inputs are escaped with `escapeRegex()` before being placed into `$regex`, so a
  query like `?search=.*` is matched literally instead of as a wildcard.
- `paginate()` caps `limit` at **100** and floors `page` at **1**, so `?limit=100000`
  can no longer dump a whole collection.
- JSON and urlencoded request bodies are limited to **1mb** (was 10mb).

**Authorization**
- Shelter self-registration can no longer set its own `shelterProfile.isVerified`; only an
  admin can grant it.
- Appointments are scoped by role. Owners and vets only ever see their own, a vet cannot
  use the `veterinarian` query param to read another vet's appointments, and shelters get
  `403`.
- Pet records are readable by the owner, an admin, or a vet with an appointment/health
  record relationship. Listing all pets is admin-only — vets use `GET /api/v1/pets/vet`.
- Pet edits/deletes and gallery changes require the pet's owner or an admin.
- Listing all orders is admin-only; owners see their own, every other role gets `403`.
- Order and appointment create/update actions only ever accept an explicit whitelist of
  fields, so clients cannot set server-controlled values such as `role`, `status`, `owner`,
  `isVerified` or rating counters through mass assignment.
- `GET /api/v1/adoptions/:id` is publicly reachable, so it no longer returns adopter names,
  emails or phone numbers. Full applicant contact details are only included for the shelter
  that owns the listing (or an admin); other callers get the applicant ids and statuses only.

**Rate limiting**
- `POST /api/v1/auth/login` and `POST /api/v1/auth/register` — 10 attempts per 15 minutes per IP
- `POST /api/v1/contact` — 5 messages per 15 minutes per IP
- All of `/api/v1` — 300 requests per 15 minutes per IP

**File uploads**
- Stored file extensions are derived from the validated MIME type, never from the
  client-supplied filename, so a file named `shell.php` cannot be stored as `.php`.
- Every upload is verified against its magic bytes after being written; a mismatch deletes
  the file and returns `400`.
- Replacing or deleting a pet, product, or adoption image removes the old file from disk.
- `/uploads` is served with `X-Content-Type-Options: nosniff`, directory listing disabled,
  and a restrictive CSP. User uploads are gitignored (the tracked `seed-*.jpg` files are
  required by `db/seed.js`).

**Errors and secrets**
- Stack traces are only included when `NODE_ENV=development`. In production, unexpected
  `500` responses return a generic message and the real error is logged server-side.
- The JWT signature algorithm is pinned to `HS256` on both sign and verify.
- `protect()` no longer loads the password hash (`select('+password')`) onto `req.user`,
  and `401` responses no longer echo the underlying JWT error message.
- The server fails fast on a missing, short, or placeholder `JWT_SECRET`.

**Dependency audit**
`npm audit` is clean in `backend/` (0 vulnerabilities). In `frontend/`, 4 findings remain
and were intentionally **not** auto-fixed because every fix is a breaking major upgrade:

| Package | Severity | Fix requires |
|---|---|---|
| `vite` (dev server, via `esbuild`) | moderate | `vite@8.x` — breaking |
| `react-router` / `react-router-dom` | moderate | `react-router-dom@7.x` — breaking |

Both only affect the local dev server / routing layer and are not exploitable from the
production build. Re-evaluate them when upgrading Vite or React Router.

### Troubleshooting

**`FATAL: JWT_SECRET must be at least 32 characters long.`**
Your `backend/.env` is missing `JWT_SECRET`, it is shorter than 32 characters, or it is
still a placeholder such as `your_secret_key`. The server refuses to boot by design.
Generate a real one and put it on a single uncommented line:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```
JWT_SECRET=<the generated 96-character value>
```

Check what dotenv actually reads (this catches lines that are commented out with `#` or
that got mangled with stray whitespace):

```bash
cd backend && node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET?.length)"
```

A number well above `32` means the server will start. Changing `JWT_SECRET` invalidates
every token already stored in the browser, so users have to log in again.

**`429 Too many attempts. Please try again in 15 minutes.`**
The login rate limiter fired (10 failed attempts per IP). Wait 15 minutes, or temporarily
raise `limit` in `backend/middleware/rateLimit.js` while testing.

> **Known future improvements:** the JWT is still stored in `localStorage` (an XSS-accessible
> store) — moving it to an httpOnly cookie would be more secure. Login currently returns a
> distinct "no account found with this email" vs "incorrect password" message, which is
> friendlier but allows email enumeration; revert to a single generic message before a
> production launch.
=======
> **Security note:** These credentials are for local development and evaluation only. Never use them, or the default `JWT_SECRET` placeholder, in a production deployment.
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

## Project Structure

```
FurShield/
├── backend/
│   ├── config/        # DB connection setup
│   ├── controllers/    # Request handlers
│   ├── db/             # Seed script
<<<<<<< HEAD
│   ├── middleware/     # Auth, validation, upload, rate limiting, sanitization, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── uploads/        # Uploaded images (gitignored, seed-*.jpg tracked for seeding)
│   ├── utils/           # Helper functions
│   ├── validators/      # express-validator rule sets
│   ├── .env.example     # Template for required environment variables
=======
│   ├── middleware/     # Auth, validation, upload, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── uploads/         # Uploaded images (gitignored)
│   ├── utils/           # Helper functions
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
│   └── server.js        # App entry point
└── frontend/
    ├── public/
    └── src/
        ├── api/          # Axios API clients
        ├── components/    # Reusable UI components
        ├── context/       # React context providers
        ├── hooks/         # Custom hooks
        ├── pages/         # Route-level pages (owner/vet/shelter/admin/public/shared)
        ├── styles/        # Global CSS
        └── utils/         # Helper functions
```

## API

All backend routes are mounted under `/api/v1`, e.g. `/api/v1/auth`, `/api/v1/pets`, `/api/v1/appointments`, `/api/v1/products`, `/api/v1/adoptions`. A health check is available at `GET /api/v1/health`.

## Notes / Constraints

- No payment gateway is implemented — the store supports browsing, cart, and order placement only.
- Veterinarian credential verification is not part of this application's scope.