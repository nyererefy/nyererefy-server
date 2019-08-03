import {Field, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('students')
export class Student {
    @Field()
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column({unique: true})
    email: string;

    @Field()
    @Column({unique: true, nullable: true})
    username?: string;

    @Field()
    @Column({nullable: true})
    name?: string;

    /**
     * Google/Facebook picture url. Can be updated manually.
     */
    @Field({nullable: true})
    @Column({nullable: true})
    avatar?: string
}

