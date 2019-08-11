import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./category";
import {University} from "./university";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

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
    createdAt: string;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    startAt?: string;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    endAt?: string;

    /**
     * OneToMany
     */
    @OneToMany(() => Category, s => s.election)
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
    @Field()
    title: string;

    @Field()
    universityId: number;
}

@InputType()
export class ElectionEditInput implements Partial<Election> {
    @Field()
    title: string;
}
