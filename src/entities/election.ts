import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;
}

