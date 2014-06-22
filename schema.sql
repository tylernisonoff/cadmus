CREATE TABLE IF NOT EXISTS users (
    id bigint PRIMARY KEY UNIQUE NOT NULL,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
    id bigserial PRIMARY KEY UNIQUE NOT NULL,
    service text NOT NULL,
    serviceId text NOT NULL,
    accessToken text NOT NULL,
    refershToken text NOT NULL,
    userId bigint NOT NULL REFERENCES users (id)
);