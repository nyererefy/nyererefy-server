import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Class} from "./class";
import {Branch} from "./branch";
import {Program} from "./program";

/**
 * Means the same thing as faculty/course
 */
@ObjectType()
@Entity('schools')
export class School {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    title: string;

    /* OneToMany */

    @OneToMany(() => Class, s => s.school)
    classes: Class[];

    /**
     * Why ManyToOne?
     * -Because School of Pharmacy offers two programs BPHARM and DPS
     */
    @OneToMany(() => Program, p => p.school)
    programs: Program[];

    /* ManyToOne */

    @ManyToOne(() => Branch, s => s.schools)
    branch: Branch;
}

