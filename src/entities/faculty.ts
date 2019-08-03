import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('faculties')
export class Faculty {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;
}

