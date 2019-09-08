import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Program} from "./program";
import {School} from "./school";
import {Field, ID} from "type-graphql";

@Entity('school_programs')
export class SchoolProgram {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => School, u => u.schoolPrograms)
    school: School;

    @ManyToOne(() => Program, {eager: true})
    program: Program;
}

