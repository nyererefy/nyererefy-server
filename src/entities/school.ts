import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Class} from "./class";
import {Branch} from "./branch";
import {IsInt, IsOptional, Length, Max} from "class-validator";
import {SchoolProgram} from "./schoolProgram";

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

    @Field({nullable: true})
    @Column({nullable: true})
    abbreviation?: string;

    /* OneToMany */

    @OneToMany(() => Class, s => s.school)
    classes: Class[];

    /**
     * Why ManyToOne?
     * -Because School of Pharmacy offers two schoolPrograms BPHARM and DPS
     */
    @Field(() => [SchoolProgram])
    @OneToMany(() => SchoolProgram, s => s.school, {eager: true})
    schoolPrograms: SchoolProgram[];

    /* ManyToOne */
    @ManyToOne(() => Branch, s => s.schools)
    branch: Branch;

    @BeforeInsert()
    clearData() {
        if (this.abbreviation) this.abbreviation = this.abbreviation.toUpperCase();
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

    @Field({nullable: true})
    @IsOptional()
    @Max(10)
    abbreviation?: string;

    @Field()
    @IsInt()
    branchId: number;
}

