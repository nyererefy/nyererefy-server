import {ArgsType, Field, Int} from "type-graphql";
import {Max, Min} from "class-validator";
import {OrderBy} from "./enums";

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, {defaultValue: 0, nullable: true})
    @Min(0)
    offset: number;

    @Field(() => Int, {defaultValue: 10, nullable: true})
    @Min(1)
    @Max(20)
    limit: number;

    @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
    orderBy: OrderBy;
}