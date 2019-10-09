import {ArgsType, Field, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Subcategory} from "./subcategory";
import {IsInt, Length} from "class-validator";
import {OrderBy} from "../utils/enums";
import {PaginationArgs} from "../utils/query";

registerEnumType(OrderBy, {name: "OrderBy"});

@ObjectType()
@Entity('reviews')
export class Review {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 250})
    content: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Subcategory, cat => cat.reviews, {nullable: false})
    subcategory: Subcategory;

    @Field(() => User)
    @ManyToOne(() => User, u => u.reviews, {nullable: false})
    user: User
}

@InputType()
export class ReviewInput implements Partial<Review> {
    @Length(1, 250)
    @Field({description: 'Max 250'})
    content: string;

    @IsInt()
    @Field(() => Int)
    subcategoryId: number;
}

@ArgsType()
export class GetReviewsArgs extends PaginationArgs {
    @Field(() => Int)
    @IsInt()
    subcategoryId: number;
}
