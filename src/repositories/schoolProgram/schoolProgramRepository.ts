import {EntityRepository, Repository} from "typeorm";
import {Program} from "../../entities/program";
import {SchoolProgram} from "../../entities/schoolProgram";
import {School} from "../../entities/school";

export interface RegisterProgramInterface {
    schoolId: number,
    programId: number
}

@EntityRepository(SchoolProgram)
export class SchoolProgramRepository extends Repository<SchoolProgram> {

    registerProgram({schoolId, programId}: RegisterProgramInterface): Promise<SchoolProgram> {
        const school = new School();
        school.id = schoolId;

        const program = new Program();
        program.id = programId;

        const universityProgram = new SchoolProgram();
        universityProgram.program = program;
        universityProgram.school = school;

        return this.save(universityProgram);
    }
}