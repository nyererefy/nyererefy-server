import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {User} from "./user";
import {University} from "./university";
import {Branch} from "./branch";
import {School} from "./school";
import {Year} from "../utils/enums";

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
        return `${this.school.program.abbreviation} ${this.year}`;
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
    @ManyToOne(() => University, u => u.classes)
    university: University;

    @ManyToOne(() => Branch, b => b.classes)
    branch: Branch;

    @ManyToOne(() => School, f => f.classes, {eager: true})
    school: School;

    /**
     * OneToMany
     */
    @OneToMany(() => User, user => user.class)
    users: User[]
}