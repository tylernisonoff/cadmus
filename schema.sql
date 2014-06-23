CREATE TABLE IF NOT EXISTS users (
    id bigint PRIMARY KEY UNIQUE NOT NULL,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
    id bigserial PRIMARY KEY UNIQUE NOT NULL,
    service text NOT NULL,
    service_id text NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    user_id bigint NOT NULL REFERENCES users (id)
);