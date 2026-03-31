# Feature Flag Tool Experimental

## Getting Started

1. Clone this repo and `cd` into your clone
1. Install dependencies

```bash
npm install
```

3. Install and run a local Postgres 17 server; on MacOS, use [Postgres.app](https://postgresapp.com/)
1. Set up your local dotenv files; `cp .env{.example,} && cp .env.test{.example,}`
1. Generate the Prisma client; `npx prisma generate`
1. Run tests; `npm test`
1. Set up your development DB; `npx prisma migrate dev` (or `npx prisma migrate reset`)
1. Run the Next.js server (and [Prisma Studio](#prisma-studio)); `npm run dev`

Set your database connection in `.env`:

```bash
DATABASE_URL="postgres://postgres:postgres@localhost:5432/feature_flag_db"
```

Apply the existing Prisma migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prisma Migrations

Use this when you change `prisma/schema.prisma` and want to create a new migration locally:

```bash
npx prisma migrate dev --name describe_your_change
```

Example:

```bash
npx prisma migrate dev --name add_feature_flags_table
```

This command will:

- Compare your schema changes against the database
- Create a new migration in `prisma/migrations`
- Apply the migration to your local database
- Regenerate the Prisma client if needed

If you only need to apply migrations that already exist in the repo, run:

```bash
npx prisma migrate dev
```
