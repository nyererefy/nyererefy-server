import {Field, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Election} from "./election";
import {Eligible} from "../utils/enums";
import {IsAlpha, IsNumber, Length} from "class-validator";
import {Subcategory} from "./subcategory";

registerEnumType(Eligible, {name: 'Eligible'});

@ObjectType()
@Entity('categories')
export class Category {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    @Field(() => Eligible, {defaultValue: Eligible.ALL})
    @Column({type: "tinyint", default: Eligible.ALL})
    eligible: Eligible;

    /**
     * If there will be live results for all descendants subcategories.
     */
    @Field()
    @Column({default: true})
    isLive: boolean;

    /**
     * OneToMany
     */
    @OneToMany(() => Subcategory, s => s.category, {onDelete: "CASCADE"})
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

    @Field({defaultValue: true})
    isLive: boolean;

    @Field(() => Eligible)
    eligible: Eligible;

    @IsNumber()
    @Field(() => Int)
    electionId: number
}

@InputType()
export class CategoryEditInput implements Partial<Category> {
    @IsAlpha()
    @Length(1, 50)
    @Field({description: 'a-zA-Z only'})
    title: string;

    @Field(() => Eligible)
    eligible: Eligible;

    @IsNumber()
    @Field(() => Int)
    categoryId: number
}

