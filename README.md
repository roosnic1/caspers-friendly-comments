# Caspers Friendly Comments

This is my attempt to solve the [coding challenge](https://ghost.notion.site/Coding-challenge-4b8ae672b90745dda06afeeea0f27267) from ghost. I used the [rest-express](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-express) example from prisma-examples as a starter.

Tech Stack:

-   Express (PUG for the view engine)
-   Prisma
-   Tailwindcss

## Getting started

Install npm dependencies:

```
cd caspers-friendly-comments
npm install
```

### 2. Create and seed the database

Create a file `.env` in the root directory and add `DATABASE_URL=%POSTGRESQL-CONNECTION%`. Run the setup command to create the database and seed it

```
npm run setup
```

### 3. Start the server

```
npm run dev
```

The server is now running on `http://localhost:3000`.

## Tests

Run the tests with the following command

```
npm run test
```
