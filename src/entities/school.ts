import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Class} from "./class";
import {Branch} from "./branch";
import {Program} from "./program";
import {IsInt, IsOptional, Length, Max} from "class-validator";
import {University} from "./university";

/**
 * Means the same thing as faculty/course
 */
@ObjectType()
@Entity('schools')
export class School {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    abbreviation: string;

    //Representation of what this school is
    @Field()
    @Column({unique: true, length: 50})
    identifier: string;

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

    @ManyToOne(() => University, s => s.schools)
    university: University;

    @BeforeInsert()
    clearData() {
        this.abbreviation = this.abbreviation.toUpperCase();
    }
}

@InputType()
export class SchoolInput implements Partial<School> {
    @Field()
    @Length(1, 100)
    title: string;

    @Field()
    @Length(1, 50)
    identifier: string;

    @Field()
    @Max(10)
    abbreviation: string;

    @Field({nullable: true})
    @IsOptional()
    @IsInt()
    branchId?: number;
}

