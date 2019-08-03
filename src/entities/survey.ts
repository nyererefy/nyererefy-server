import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('surveys')
export class Survey {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;
}

