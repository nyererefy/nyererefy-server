import admin from "firebase-admin";

const serviceAccount = require("../../credentials/firebase-adminsdk.json");

export function initFirebase() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://nyererefy-3dcad.firebaseio.com"
    });
}