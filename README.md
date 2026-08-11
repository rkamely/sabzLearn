# SimCard Market API

A RESTful backend for a SIM card marketplace with installment/credit purchase support, built with Node.js, Express, and MongoDB (Mongoose). Alongside the SIM card store it bundles a lightweight LMS and content platform (courses, articles, comments, tickets, notifications, vouchers).

## Features

- **SIM card store** — browse, filter (by type, usage, price range, number pattern with wildcard search), and sort listings
- **Installment & credit calculator** — compute cash vs. installment terms, monthly payments, prepayment percentages, and total cost per SIM
- **OTP-based auth** — mobile-number registration with OTP verification and JWT access tokens
- **User profiles** — profile info and updates with request validation
- **Role-based access** — `USER` / `ADMIN` roles guarded by auth and admin middleware
- **Content platform** — courses (with sessions & covers), articles, categories, comments, search
- **Support tools** — tickets with departments/sub-departments, contact form, notifications, vouchers/campaigns
- **File uploads** — cover images handled via Multer, served statically

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MongoDB via Mongoose 8
- **Auth:** JSON Web Tokens (`jsonwebtoken`), password hashing with `bcrypt`
- **Validation:** `fastest-validator`
- **Uploads:** `multer`
- **Email:** `nodemailer`
- **Config:** `dotenv`

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### Installation

```bash
git clone https://github.com/rkamely/simcard-back-mongoose.git
cd simcard-back-mongoose
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/simcard
JWT_SECRET=your_super_secret_key
```

### Run

```bash
# development (auto-reload via nodemon)
npm run dev
```

The server starts on `http://localhost:5000` (or the `PORT` you set) and connects to MongoDB on boot.

## Project Structure

```
.
├── app.js              # Express app: middleware + route mounting
├── server.js           # Entry point: DB connection + server start
├── controllers/v1/     # Route handlers (business logic)
├── routes/v1/          # API route definitions
├── models/             # Mongoose schemas
├── middlewares/        # auth (JWT) and isAdmin guards
├── validators/         # fastest-validator schemas
├── utils/              # uploader (multer), referral code generator
└── public/             # statically served cover images
```

## API Overview

All routes are versioned under `/v1`.

| Base path            | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `/v1/auth`           | Register, verify OTP, login, current user      |
| `/v1/users`          | Profile info/update, admin user management     |
| `/v1/sim-cards`      | List/filter SIMs, filter configs, installments |
| `/v1/category`       | Category CRUD                                  |
| `/v1/courses`        | Courses, sessions, enrollment                  |
| `/v1/article`        | Articles CRUD                                  |
| `/v1/comments`       | Comments (create, accept/reject, answer)       |
| `/v1/contact`        | Contact form submissions                       |
| `/v1/search`         | Keyword search                                 |
| `/v1/notification`   | Notifications                                  |
| `/v1/voucher`        | Vouchers & campaigns                           |
| `/v1/orders`         | Orders                                         |
| `/v1/ticket`         | Support tickets & departments                  |
| `/v1/menu`           | Site menus                                     |

### Selected SIM card endpoints

- `POST /v1/sim-cards/` — list SIM cards with filtering, sorting, and pagination (`skip`, `take`, `simcardType`, `typeUsing`, `minPrice`, `maxPrice`, `number`, `sort`)
- `GET  /v1/sim-cards/filter-configs` — available filter options (area codes, price bounds, types)
- `GET  /v1/sim-cards/installment-term?id=<simId>` — cash vs. installment terms for a SIM
- `POST /v1/sim-cards/call-prices-sim-card` — calculate installment breakdown
- `POST /v1/sim-cards/register-sim-card` — add a SIM (auth required)

### Auth flow

1. `POST /v1/auth/register?mobileNumber=<num>` — validates and checks ban list
2. `POST /v1/auth/verify-otp?mobileNumber=<num>&otp=<code>` — verifies OTP, creates the user if new, returns a JWT
3. Send the token as `Authorization: Bearer <token>` on protected routes

> Note: OTP verification currently uses a fixed development code. Wire it to a real SMS/OTP provider before production use.

## Security Notes

- Keep `JWT_SECRET` and `MONGO_URI` out of version control — they live in `.env`, which is git-ignored.
- Replace the placeholder OTP logic with a real provider and rate limiting before deploying.
- Consider adding request rate limiting and HTTP security headers (e.g. `helmet`) for production.

## License

ISC
