import {Connection} from "typeorm";
import {testConnection} from "./testConnection";

function initTestDb() {
    let con: Connection;

    beforeAll(async () => {
        con = await testConnection()
    });

    afterAll(async () => {
        await con.close()
    });
}

initTestDb();