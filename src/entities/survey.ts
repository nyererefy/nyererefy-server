import {Field, ID, ObjectType, registerEnumType} from "type-graphql";
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Eligible, SurveyOptionsType} from "../utils/enums";
import {SurveyOption} from "./surveyOption";

registerEnumType(SurveyOptionsType, {name: 'SurveyOptionsType'});

@ObjectType()
@Entity('surveys')
export class Survey {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    @Field({nullable: true})
    @Column({type: "text"})
    body: string;

    @Field()
    @Column({type: "tinyint"})
    eligible: Eligible;

    @Field({description: 'if false then no opinion will be added or loaded from server'})
    @Column({default: true})
    allowOpinions: boolean;

    @Field({description: 'shows how input will be shown on ui'})
    @Column({type: "tinyint"})
    SurveyOptionsType: SurveyOptionsType;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field({nullable: true})
    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany(() => SurveyOption, s => s.survey, {onDelete: "RESTRICT"})
    options: SurveyOption[];
}

