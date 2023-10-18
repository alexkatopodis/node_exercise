CREATE TABLE IF NOT EXISTS "Users" (
  "id" serial PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "birthdate" DATE NOT NULL,
  "gender" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "Messages" (
  "id" serial PRIMARY KEY,
  "content" VARCHAR(255) NOT NULL,
  "sender" INTEGER NOT NULL,
  "receiver" INTEGER NOT NULL,
  "seen" BOOLEAN NOT NULL DEFAULT FALSE,
  "timestampSent" TIMESTAMP NOT NULL
);
