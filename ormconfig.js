const {REDIS_HOST, REDIS_DB, REDIS_PORT, REDIS_PASSWORD, MYSQL_PORT, MYSQL_DB, MYSQL_PASSWORD, MYSQL_USERNAME}
    = require("./src/utils/consts");
const config = require('config');

module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": config.get(MYSQL_PORT),
    "username": config.get(MYSQL_USERNAME),
    "password": config.get(MYSQL_PASSWORD),
    "database": config.get(MYSQL_DB),
    "entities": [
        "src/entities/*.*"
    ],
    "logging": config.get("logging"),
    "synchronize": config.get("synchronize"),
    "trace": config.get("trace"),
    cache: {
        type: "redis",
        options: {
            host: config.get(REDIS_HOST),
            port: config.get(REDIS_PORT),
            db: config.get(REDIS_DB),
            password: config.get(REDIS_PASSWORD)
        }
    }
};