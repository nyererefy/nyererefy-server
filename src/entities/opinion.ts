import {Field, ID, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "./user";
import {Survey} from "./survey";

/**
 * Options will will be shown joined with vote user submitted.
 * Users can have many opinions on certain survey/RESTRICT this once you find
 * a way to their opinions first.
 */
@ObjectType()
@Entity('opinions')
export class Opinion {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({nullable: true, description: 'For showing little summary.'})
    @Column({length: 50, nullable: true})
    title: string;

    @Field({description: 'The whole content.'})
    @Column({type: "text"})
    body: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    @Field({nullable: true})
    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Survey)
    survey: Survey;
}

