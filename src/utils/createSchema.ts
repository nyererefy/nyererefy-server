import {buildSchema} from "type-graphql";
import {pubSub} from "./redis";

export const createSchema = () => buildSchema({
    //This will include all resolvers found in resolvers dir.
    resolvers: [__dirname + "/../resolvers/**/*.resolver.ts"],
    pubSub: pubSub,
    dateScalarMode: "timestamp", // "timestamp" or "isoDate"
});