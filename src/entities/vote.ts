import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('votes')
export class Vote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;
}

