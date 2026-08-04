-- identity schema + users table (PDF profile fields)
CREATE TABLE IF NOT EXISTS identity.users (
    id              UUID PRIMARY KEY,
    alias           VARCHAR(30)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(80)  NOT NULL,
    last_name       VARCHAR(80)  NOT NULL,
    birth_date      DATE         NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_alias ON identity.users (alias);
CREATE INDEX IF NOT EXISTS idx_users_email ON identity.users (email);
