import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./category";
import {University} from "./university";
import {IsAlpha} from "class-validator";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    isOpen: boolean;

    /**
     * If is strict that means one vote per ip for certain category.
     */
    @Field()
    @Column()
    isStrict: boolean;

    /**
     * This will make this category be eligible to all who share the eligibility regardless of university or branch
     * This will only work for program/sex/all
     */
    @Field()
    @Column()
    isExtended: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    startAt?: Date;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    endAt?: Date;

    /**
     * OneToMany
     */
    @OneToMany(() => Category, c => c.election)
    categories: Category[];

    /**
     * ManyToOne
     */

    /**
     * nullable: true because we can create election which are not un-based.
     */
    @ManyToOne(() => University, u => u.elections, {nullable: true})
    university?: University
}

@InputType()
export class ElectionInput implements Partial<Election> {
    @IsAlpha()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;
}

@InputType()
export class ElectionEditInput implements Partial<Election> {
    @IsAlpha()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;
}
