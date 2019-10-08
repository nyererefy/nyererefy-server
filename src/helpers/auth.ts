import passport from 'passport';
// @ts-ignore
import {Strategy as GoogleStrategy} from "passport-token-google";
import config from "config";
import {Request, Response} from "express";

const {clientId, secret} = config.get('auth.google');

passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: secret
    },
    function (accessToken: string, refreshToken: string, profile: any, done: any) {
        return done(null, {
            accessToken,
            refreshToken,
            profile,
        });
    }
));

export const authenticateWithGoogle = (req: Request, res: Response) => new Promise((resolve, reject) => {
    passport.authenticate('google-token', {session: false}, (err, data, info) => {
        if (err) reject(err);
        resolve({data, info});
    })(req, res);
});