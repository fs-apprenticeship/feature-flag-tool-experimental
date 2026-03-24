# Feature Flag Tool Experimental

## Getting Started

Install dependencies:

```bash
npm install
```

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
