import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Candidate} from "./candidate";
import {Election} from "./election";
import {Eligible} from "../utils/enums";
import {Vote} from "./vote";

@ObjectType()
@Entity('categories')
export class Category {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column({type: "enum", enum: Eligible})
    eligible: Eligible;


    /**
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.category)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.category)
    votes: Vote[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => Election, s => s.categories)
    election: Election;
}

