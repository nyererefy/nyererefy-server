import "reflect-metadata";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {createSchema} from "./utils/createSchema";
import {createConnection} from "typeorm";
import {registerCronJobs} from "./helpers/cronJob";
import {registrationRouter} from "./routes/register";
import bodyParser from "body-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import {redis} from "./utils/redis";
import {COOKIE_NAME} from "./utils/consts";
import config from "config";

const RedisStore = connectRedis(session);

//todo disable mysqli erroes in production.
const bootstrap = async () => {
    //Db connection.
    await createConnection();
    //cron jobs.
    registerCronJobs();

    const store = new RedisStore({
        client: redis as any,
        logErrors: true
    });

    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({req, res}: any) => ({req, res})
    });

    const app = express();

    app.use(session({
        store,
        name: COOKIE_NAME,
        secret: config.get('session_secret'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24  // 1 day
        }
    }));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(registrationRouter);
    const httpServer = http.createServer(app);
    const PORT = process.env.port || 2000;

    apolloServer.applyMiddleware({app});
    apolloServer.installSubscriptionHandlers(httpServer);

    //`listen` on the http server variable, and not on `app`.
    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
    })
};

bootstrap().catch(e => console.log(e));

