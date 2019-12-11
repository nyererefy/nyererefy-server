import {getCustomRepository} from "typeorm";
import admin from "firebase-admin";
import {FirebaseRepository} from "../repositories/firebaseTokens/firebaseRepository";

export interface NotificationInterface {
    title: string,
    body: string,
    userId: number
}

export interface BulkNotificationInterface {
    title: string,
    body: string,
}

function pushNotification(title: string, body: string, token: string | string[]) {
    const payload = {
        notification: {title, body}
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(token, payload, options)
        .then(function (response: any) {
            console.log("Successfully sent message:", response);
            return true
        })
        .catch(function (error: any) {
            console.log("Error sending message:", error);
            return false
        });
}

export async function notifyUser({title, body, userId}: NotificationInterface) {
    const repository = getCustomRepository(FirebaseRepository);

    const firebaseTokens = await repository.findUserFirebaseTokens(userId);

    //Notify all users devices.
    for (let i = 0; i < firebaseTokens.length; i++) {
        const tkn = firebaseTokens[i];
        const titleWithName = `${tkn.user.name || tkn.user.username || tkn.user.regNo}, ${title}`;
        pushNotification(titleWithName, body, tkn.token);
    }
}

export async function notifyAll({title, body}: BulkNotificationInterface) {
    const repository = getCustomRepository(FirebaseRepository);

    const firebaseTokens = await repository.findAllUsersFirebaseTokens();
    const tokens = firebaseTokens.map(t => t.token);

    pushNotification(title, body, tokens);
}

//todo notify university.