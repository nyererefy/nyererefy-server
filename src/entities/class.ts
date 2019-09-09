import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {User} from "./user";
import {School} from "./school";
import {Year} from "../utils/enums";
import {Program} from "./program";

/**
 * These are generated automatically..
 */
@ObjectType()
@Entity('classes')
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Resolved from School abbreviation and year.
     * This will return string like MD 5 or BPHARM 3
     */
    @Field()
    get title(): string {
        return `${this.abbreviation} ${this.year}`;
    }

    @Column({length: 20})
    abbreviation: string;

    /**
     * This can also be generated on fly!! Basing on below years right?
     */
    @Column({type: "tinyint", default: Year.COMPLETED})
    year: Year;

    /**
     * Year this class started.
     */
    @Column('datetime', {nullable: true})
    startedAt: Date;

    /**
     * Year this class ends.
     */
    @Column('datetime', {nullable: true})
    endedAt: Date;

    /**
     * ManyToOne
     */

    @ManyToOne(() => School, f => f.classes)
    school: School;

    /**
     * Program can be shared by many classes from different universities.
     */
    @Field(() => Program)
    @ManyToOne(() => Program, f => f.classes)
    program: Program;

    /**
     * OneToMany
     */
    @OneToMany(() => User, user => user.class)
    users: User[];
}