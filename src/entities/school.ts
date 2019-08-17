import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Class} from "./class";
import {Branch} from "./branch";
import {University} from "./university";
import {Program} from "./program";

/**
 * Todo how to make these reusable?
 * 1. May be we should have specific table for programs.
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

    /**
     * OneToMany
     */

    @OneToMany(() => Class, s => s.school)
    classes: Class[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => Branch, s => s.schools)
    branch: Branch;

    /**
     * Why ManyToOne?
     * -Because School of Pharmacy offers two programs BPHARM and DPS
     */
    @ManyToOne(() => Program, p => p.schools)
    program: Program;

    @ManyToOne(() => University, u => u.schools)
    university: University;
}

