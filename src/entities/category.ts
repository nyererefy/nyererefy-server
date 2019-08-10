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
     * This will make this category be eligible to all who share the eligibility regardless of university or branch
     * This will only work for program/sex/all
     */
    @Field()
    @Column()
    isExtended: boolean;

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

