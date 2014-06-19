CREATE TABLE IF NOT EXISTS users (
    id int PRIMARY KEY UNIQUE NOT NULL,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
    id bigserial PRIMARY KEY UNIQUE NOT NULL,
    service text NOT NULL,
    access_token text NOT NULL,
    refersh_token text NOT NULL,
    user_id int NOT NULL REFERENCES users (id)
);