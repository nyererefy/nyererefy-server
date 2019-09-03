import {Connection} from "typeorm";
import {testConnection} from "./testConnection";
import {insertDummyData} from "./initDummyData";

const initTestDb = () => {
    let con: Connection;

    beforeAll(async () => {
        con = await testConnection(true);
        await insertDummyData();
    });

    afterAll(async () => {
        await con.close()
    });
};

initTestDb();