import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Survey} from "./survey";

@ObjectType()
@Entity('survey_options')
export class SurveyOption {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 50})
    title: string;

    @Field()
    @Column()
    votesCount: number;

    @ManyToOne(() => Survey, s => s.options)
    survey: Survey;
}

