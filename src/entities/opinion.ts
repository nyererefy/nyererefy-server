import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('opinions')
export class Opinion {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
}

