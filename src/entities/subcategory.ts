import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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

    /**
     * OneToMany
     */
    @Field(() => [Candidate]) //todo use field resolver.
    @OneToMany(() => Candidate, s => s.subcategory, {onDelete: "CASCADE", eager: true})
    candidates: Candidate[];

    //If there are votes then we should restrict.
    @OneToMany(() => Vote, s => s.subcategory, {onDelete: "RESTRICT"})
    votes: Vote[];

    //If there are reviews then we should restrict.
    @OneToMany(() => Review, s => s.subcategory, {onDelete: "RESTRICT"})
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
    @Column()
    ref: number;

    /**
     * For sex specifically
     */
    @Column({nullable: true})
    extraRef?: number;
}

