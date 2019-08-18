import {Field, ID, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./category";
import {User} from "./user";

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

    @ManyToOne(() => Category, cat => cat.votes, {nullable: false})
    category: Category;

    @Field(() => User)
    @ManyToOne(() => User, u => u.reviews, {eager: true, nullable: false})
    user: User
}

