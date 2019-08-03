import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity('candidates')
export class Candidate {
    /**
     * Not meant to be human readable...
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    readonly id: string;

    /**
     * Cloud storage link...
     */
    @Field({nullable: true})
    @Column({nullable: true})
    image?: string
}

