import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Candidate} from "./candidate";
import {Election} from "./election";
import {Eligible} from "../utils/enums";
import {Vote} from "./vote";
import {IsAlpha, IsNumber} from "class-validator";

@ObjectType()
@Entity('categories')
export class Category {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

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

@InputType()
export class CategoryInput implements Partial<Category> {
    @IsAlpha()
    @Field({description: 'a-zA-Z only'})
    title: string;

    @Field()
    eligible: Eligible;

    @IsNumber()
    @Field()
    electionId: number
}

@InputType()
export class CategoryEditInput implements Partial<Category> {
    @IsAlpha()
    @Field({description: 'a-zA-Z only'})
    title: string;

    @Field()
    eligible: Eligible;
}

