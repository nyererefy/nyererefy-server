const config = require('config');

module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": config.get('mysql_port'),
    "username": config.get('mysql_username'),
    "password": config.get('mysql_password'),
    "database": config.get('mysql_db'),
    "entities": [
        "src/entities/*.*"
    ],
    "logging": config.get("logging"),
    "synchronize": config.get("synchronize"),
    "trace": config.get("trace"),
    cache: {
        type: "redis",
        options: {
            host: config.get('redis_host'),
            port: config.get('redis_port'),
            db: config.get('redis_db'),
            password: config.get('redis_password')
        }
    }
};