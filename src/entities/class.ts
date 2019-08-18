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
        return `${this.program.abbreviation} ${this.year}`;
    }

    /**
     * This can also be generated on fly!! Basing on below years right?
     */
    @Column({type: 'enum', enum: Year, default: Year.COMPLETED})
    year: Year;

    /**
     * Year this class started.
     */
    @Column('datetime', {nullable: true})
    startedAt?: string;

    /**
     * Year this class ends.
     */
    @Column('datetime', {nullable: true})
    endedAt?: string;

    /**
     * ManyToOne
     */

    @ManyToOne(() => School, f => f.classes, {eager: true})
    school: School;

    /**
     * Program can be shared by many classes from different universities.
     */
    @Field(() => Program)
    @ManyToOne(() => Program, f => f.classes, {eager: true})
    program: Program;

    /**
     * OneToMany
     */
    @OneToMany(() => User, user => user.class)
    users: User[];

}