import {buildSchema} from "type-graphql";

export const createSchema = () => buildSchema({
    //This will include all resolvers found in resolvers dir.
    resolvers: [__dirname + "/../resolvers/**/*.resolver.ts"],
});