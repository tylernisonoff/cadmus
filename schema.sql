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

CREATE TABLE IF NOT EXISTS connections (
    id bigserial PRIMARY KEY UNIQUE NOT NULL,
    service text NOT NULL,
    uid text NOT NULL,
    name text NOT NULL,
    data json NOT NULL,
    task_id bigint UNIQUE
);

CREATE TABLE IF NOT EXISTS credentials_connections (
    credential_id bigint NOT NULL REFERENCES credentials (id),
    connection_id bigint NOT NULL REFERENCES connections (id),
    UNIQUE(credential_id, connection_id)
);