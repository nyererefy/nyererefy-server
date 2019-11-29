import "reflect-metadata";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import express, {Request, Response} from "express";
import {createSchema} from "./utils/createSchema";
import {createConnection} from "typeorm";
import {registerCronJobs} from "./helpers/cronJob";
import {bridgeRouter} from "./routes/register";
import bodyParser from "body-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import {redis} from "./utils/redis";
import {COOKIE_NAME} from "./utils/consts";
import config from "config";
import cors from "cors";
import path from "path";

const RedisStore = connectRedis(session);

//todo disable mysqli errors in production.
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

    app.use(cors({
        credentials: process.env.NODE_ENV !== "production",
        origin: ['http://localhost:3000', ' http://192.168.43.228:2000'] //React app.
    }));

    app.use(session({
        store,
        name: COOKIE_NAME,
        secret: config.get('session_secret'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
        }
    }));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '..', 'public/web')));
    app.use(express.static(path.join(__dirname, '..', 'public/manage')));
    app.use(express.static(path.join(__dirname, '..', 'public/terminal')));
    app.use(bridgeRouter);
    const httpServer = http.createServer(app);
    const PORT = process.env.port || 2000;

    // ref : https://dev.to/tmns/session-handling-in-react-with-redux-express-session-and-apollo-18j8
    apolloServer.applyMiddleware({app, cors: false});
    apolloServer.installSubscriptionHandlers(httpServer);

    app.get('/manage/', function (_req: Request, res: Response) {
        res.sendFile(path.join(__dirname, '..', 'public/manage', 'index.html'));
    });

    app.get('/terminal/', function (_req: Request, res: Response) {
        res.sendFile(path.join(__dirname, '..', 'public/terminal', 'index.html'));
    });

    app.get('*', function (_req: Request, res: Response) {
        res.sendFile(path.join(__dirname, '..', 'public/web', 'index.html'));
    });

    //`listen` on the http server variable, and not on `app`.
    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
    })
};

bootstrap().catch(e => console.log(e));

