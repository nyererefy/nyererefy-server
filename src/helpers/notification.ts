import {getCustomRepository} from "typeorm";
import admin from "firebase-admin";
import {FirebaseRepository} from "../repositories/firebaseTokens/firebaseRepository";


export interface NotificationInterface {
    title: string,
    body: string,
    token: string
}

export interface BulkNotificationInterface {
    title: string,
    body: string,
}

export async function pushNotification({title, body, token}: NotificationInterface) {
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

//todo find a way to push bulk notifications
export async function notifyAll({title, body}: BulkNotificationInterface) {
    const repository = getCustomRepository(FirebaseRepository);

    const firebaseTokens = await repository.findAllUsersFirebaseTokens();

    for (let i = 0; i < firebaseTokens.length; i++) {
        const firebaseToken = firebaseTokens[i];

        await pushNotification({title, body, token: firebaseToken.token});
    }

    return true
}