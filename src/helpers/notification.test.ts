import {notifyAll, notifyUser} from "./notification";
import {createConnection} from "typeorm";
import {initFirebase} from "./initFirebase";

beforeAll(async () => {
    initFirebase();
    await createConnection()
});

describe('Notification', () => {
    it('should notify all users', async function () {
        await notifyAll({title: "Test notification", body: "Test body"})
    });

    it('should notify a single user', async function () {
        await notifyUser({
            userId: 1,
            title: "Test notification",
            body: "Test body"
        })
    });
});