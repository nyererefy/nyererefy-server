import {Field, ID, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Subcategory} from "./subcategory";

@ObjectType()
@Entity('reviews')
export class Review {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    content: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Subcategory, cat => cat.votes, {nullable: false})
    subcategory: Subcategory;

    @Field(() => User)
    @ManyToOne(() => User, u => u.reviews, {eager: true, nullable: false})
    user: User
}

