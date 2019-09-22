import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Program} from "./program";
import {School} from "./school";
import {Field, InputType, ObjectType} from "type-graphql";
import {IsAlphanumeric, IsInt} from "class-validator";

@ObjectType()
@Entity('school_programs')
export class SchoolProgram {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    //Representation of what this program is
    @Field()
    @Column({length: 50})
    identifier: string;

    @ManyToOne(() => School, u => u.schoolPrograms)
    school: School;

    @Field()
    @ManyToOne(() => Program, {eager: true})
    program: Program;
}

@InputType()
export class SchoolProgramInput {
    @Field()
    @IsInt()
    schoolId: number;

    @Field()
    @IsInt()
    programId: number;

    @Field()
    @IsAlphanumeric()
    identifier: string;
}

