export var FIND_USER = "SELECT * FROM users WHERE id = $1";
export var INSERT_USER = "INSERT INTO users(id, name) VALUES ($1, $2);";
export var FIND_CREDENTIALS = "SELECT * FROM credentials WHERE service = $1 AND userId = $2;";
export var INSERT_CREDENTIALS = "INSERT INTO credentials(service, serviceId, accessToken, refreshToken, userId) " +
    "VALUES ($1, $2, $3, $4, $5) RETURNING id;";
