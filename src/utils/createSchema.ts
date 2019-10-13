import {buildSchema} from "type-graphql";
import {pubSub} from "./redis";
import {Guard} from "./Guard";

export const createSchema = () => buildSchema({
    //This will include all resolvers found in resolvers dir.
    resolvers: [__dirname + "/../resolvers/**/*.resolver.ts"],
    pubSub: pubSub,
    authChecker: Guard,
    dateScalarMode: "timestamp", // "timestamp" or "isoDate"
    //authMode: "null" //Not trowing error.
});