import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('categories')
export class Category {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;
}

