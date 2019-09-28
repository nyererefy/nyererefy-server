import {ArgsType, Field, ID, InputType, ObjectType, registerEnumType} from "type-graphql";
import {BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Duration} from "../utils/enums";
import {Class} from "./class";
import {IsBoolean, Length} from "class-validator";
import {SchoolProgram} from "./schoolProgram";
import {PaginationArgs} from "../utils/query";

registerEnumType(Duration, {name: 'Duration'});

/**
 * This stores schoolPrograms which are reusable to all universities.
 * Eg Bachelor of Pharmacy 4 years schoolPrograms.
 * Eg Bachelor of Laboratory 3 years schoolPrograms.
 * Universities and Colleges should start here.
 * Todo this should be the first step when registering a university and then we should generate schools automatically.
 * TODO WE ARE THE ONE WHO REGISTER PROGRAMS.
 */
@ObjectType()
@Entity('programs')
export class Program {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    //Unique because we register schoolPrograms only once.
    @Field()
    @Column({unique: true})
    title: string;

    @Field()
    @Column({unique: true})
    abbreviation: string;

    @Field(() => Duration)
    @Column({type: "tinyint"})
    duration: Duration;

    /* OneToMany */

    /**
     * This is helpful to know how many classes have similar schoolPrograms.
     * Like in kichuo
     */
    @OneToMany(() => Class, s => s.program)
    classes: Class[];

    @OneToMany(() => SchoolProgram, s => s.program)
    university_programs: SchoolProgram[];

    @BeforeInsert()
    clearData() {
        this.abbreviation = this.abbreviation.toUpperCase();
    }
}

@InputType()
export class ProgramInput implements Partial<Program> {
    @Field()
    @Length(5, 100)
    title: string;

    @Field()
    @Length(2, 10)
    abbreviation: string;

    @Field()
    duration: Duration;
}

@ArgsType()
export class GetProgramsArgs extends PaginationArgs {
    @Field({
        nullable: true,
        defaultValue: true,
        description: 'If this is true then only university\'s registered programs will be returned'
    })
    @IsBoolean()
    filter: boolean;
}