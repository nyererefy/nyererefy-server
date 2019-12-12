import nodemailer from "nodemailer";
import config from "config";
import Mail from "nodemailer/lib/mailer";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/user/userRepository";

export interface EmailInterfaceToUser {
    id: number
    subject: string
    html: string
}

export interface EmailInterface {
    to: string | string[]
    subject: string
    html: string
}

export async function sendEmailToUser({id, subject, html}: EmailInterfaceToUser) {
    const repository = getCustomRepository(UserRepository);
    const user = await repository.findUser(id);

    await sendEmail({to: user.email, subject, html})
}

export async function sendEmailToAllUsers(subject: string, html: string) {
    const repository = getCustomRepository(UserRepository);
    const user = await repository.findAllUsersEmails();

    await sendEmail({to: user.map(u => u.email), subject, html})
}

export async function sendEmail({to, subject, html}: EmailInterface) {
    const transporter = nodemailer.createTransport(config.get('transporter'));

    const mailOptions: Mail.Options = {
        from: 'support@nyererefy.com',
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}