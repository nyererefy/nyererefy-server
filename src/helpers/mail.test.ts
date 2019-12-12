import {sendEmail, sendEmailToAllUsers, sendEmailToUser} from "./mail";
import {createConnection} from "typeorm";
import {WELCOME_EMAIL} from "../utils/emails";

beforeAll(async () => {
    await createConnection()
});

describe('Mail', () => {
    it('should send welcome email', async function () {
        await sendEmail({
            to: "syl@gmail.com",
            subject: "Welcome to Nyererefy",
            html: WELCOME_EMAIL
        })
    });

    it('should send mail to a user', async function () {
        await sendEmailToUser({
            id: 1,
            subject: "Email to one user",
            html: WELCOME_EMAIL
        })
    });

    it('should send mail to all users', async function () {
        await sendEmailToAllUsers(
            "Email to all users",
            "<h1>Hi, Welcome to Nyererefy</h1>"
        )
    });
});