export var FIND_USER = "SELECT * FROM users WHERE id = $1";
export var INSERT_USER = "INSERT INTO users(id, name) VALUES ($1, $2);";
export var FIND_CREDENTIALS = "SELECT id, " +
    "service, " +
    "service_id AS serviceId, " +
    "access_token AS accessToken, " +
    "refresh_token AS refreshToken, " +
    "user_id AS userId " +
    "FROM credentials WHERE service = $1 AND user_id = $2;";
export var INSERT_CREDENTIALS = "INSERT INTO credentials(" +
    "service, " +
    "service_id, " +
    "access_token, " +
    "refresh_token, " +
    "user_id) " +
    "VALUES ($1, $2, $3, $4, $5) RETURNING id;";
