import {notifyAll, notifyUser, pushNotification} from "./notification";
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

    it('should push notification', async function () {
        await pushNotification(
            "Test notification",
            "Test body",
            "caHRAQ-WESE:APA91bHidnBsZpTDZhv9byg4l0YVXT1pF5s54t0Bx9dpzmvA8g2jVfs6ftcjkcHTfJTZJwirj_fDEm2sJIwGHXVhYJsS9TROsINUTG_LdKRZRhbbNevReXv4MY3bBPX9NVkN1H7CPS5v"
        )
    });
});