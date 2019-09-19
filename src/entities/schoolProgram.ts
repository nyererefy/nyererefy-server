import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Program} from "./program";
import {School} from "./school";

@Entity('school_programs')
export class SchoolProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => School, u => u.schoolPrograms)
    school: School;

    @ManyToOne(() => Program, {eager: true})
    program: Program;
}

