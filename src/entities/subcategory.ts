import {Field, ID, ObjectType} from "type-graphql";
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Candidate} from "./candidate";
import {Vote} from "./vote";
import {Review} from "./review";
import {Category} from "./category";

/**
 * These are generated automatically with one click "Generate".
 * todo add winner field that when election ends winner is declared automatically and notify every body.
 */
@ObjectType()
@Entity('subcategories')
export class Subcategory {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    @Field({description: 'auto-generated texts to show hint of who are allowed to vote.'})
    @Column({length: 100})
    suffix: string;

    @BeforeInsert()
    clearData() {
        this.suffix = this.suffix.toUpperCase();
    }

    /**
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.subcategory)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.subcategory)
    votes: Vote[];

    @OneToMany(() => Review, s => s.subcategory)
    reviews: Review[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => Category, s => s.subcategories)
    category: Category;

    /**
     * OneToOne
     */
    @OneToOne(() => Candidate, {nullable: true})
    @JoinColumn()
    winner: Candidate;

    /**
     * For intelligence.
     */
    @Column({nullable: true})
    ref?: number;

    /**
     * For sex specifically
     */
    @Column({nullable: true})
    extraRef: string;
}

/***
 * ways to make this work
 * 1. integrate all filters here and use them during fetching. branch, school,class all here as FK.
 */

