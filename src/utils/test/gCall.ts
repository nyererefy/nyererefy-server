import {graphql, GraphQLSchema} from "graphql";
import {createSchema} from "../createSchema";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any
    }>;
}

let schema: GraphQLSchema;

export const gCall = async ({source, variableValues}: Options) => {
    //Caching schema so that it wont be created every time.
    if (!schema) {
        schema = await createSchema()
    }

    return graphql({
        schema,
        source,
        variableValues
    })
};