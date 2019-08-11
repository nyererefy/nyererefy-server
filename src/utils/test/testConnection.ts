import {createConnection} from 'typeorm';

export const testConnection = (drop: boolean = false) => {
    return createConnection({
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "",
        "database": "nyererefy", //Todo change to test.
        "entities": [__dirname + "/../../entities/*.*"],
        "synchronize": true,
        dropSchema: drop
    })
};