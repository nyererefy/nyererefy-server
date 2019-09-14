import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Election} from "./election";
import {Eligible} from "../utils/enums";
import {IsAlpha, IsNumber, Length} from "class-validator";
import {Subcategory} from "./subcategory";

@ObjectType()
@Entity('categories')
export class Category {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    @Field({defaultValue: Eligible.ALL})
    @Column({type: "tinyint", default: Eligible.ALL})
    eligible: Eligible;

    /**
     * OneToMany
     */
    @OneToMany(() => Subcategory, s => s.category)
    subcategories: Subcategory[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => Election, s => s.categories)
    election: Election;
}

@InputType()
export class CategoryInput implements Partial<Category> {
    @IsAlpha()
    @Length(1, 50)
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
    @Length(1, 50)
    @Field({description: 'a-zA-Z only'})
    title: string;

    @Field()
    eligible: Eligible;

    @IsNumber()
    @Field()
    categoryId: number
}

