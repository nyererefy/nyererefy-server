import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Survey} from "./survey";
import {IsInt} from "class-validator";

@ObjectType()
@Entity('survey_votes')
export class SurveyVote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int", unique: true})
    guard: number;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    /**
     * ManyToOne
     */
    @ManyToOne(() => User, s => s.votes)
    user: User;

    @ManyToOne(() => Survey)
    survey: Survey;
}

@InputType()
export class SurveyVoteInput {
    @IsInt()
    @Field(() => Int, {description: 'id of survey'})
    id: number;
}

