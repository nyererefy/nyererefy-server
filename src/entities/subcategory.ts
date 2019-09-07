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
import {Election} from "./election";

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

    @ManyToOne(() => Election, s => s.subcategories)
    election: Election;

    /**
     * OneToOne
     */
    @OneToOne(() => Candidate, {nullable: true})
    @JoinColumn()
    winner: Candidate;
}

