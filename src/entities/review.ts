import {ArgsType, Field, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Subcategory} from "./subcategory";
import {IsInt, Length, Max, Min} from "class-validator";
import {OrderBy} from "../utils/enums";

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
    @Field()
    subcategoryId: number;
}

@ArgsType()
export class GetReviewsArgs {
    @Field(() => Int)
    @IsInt()
    subcategoryId: number;

    @Field(() => Int, {defaultValue: 0, nullable: true})
    @Min(0)
    offset: number;

    @Field(() => Int, {defaultValue: 10, nullable: true})
    @Min(1)
    @Max(20)
    limit: number;

    @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.ASC})
    orderBy: OrderBy;
}
