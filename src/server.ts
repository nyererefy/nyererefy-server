import "reflect-metadata";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {createSchema} from "./utils/createSchema";
import {createConnection} from "typeorm";
import {registerCronJobs} from "./helpers/cronJob";
//todo disable mysqli erroes in production.
const bootstrap = async () => {
    //Db connection.
    await createConnection();
    //cron jobs.
    registerCronJobs();

    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({req, res}: any) => ({req, res})
    });

    const app = express();
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

