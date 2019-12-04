import {EntityRepository, Repository} from "typeorm";
import {Program, ProgramInput} from "../../entities/program";
import {SchoolProgram} from "../../entities/schoolProgram";
import {School} from "../../entities/school";
import {Branch} from "../../entities/branch";

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {
    createProgram(input: ProgramInput) {
        const program = this.create(input);

        return this.save(program);
    }

    async editProgram(id: number, input: ProgramInput) {
        let program = await this.findOne(id);
        if (!program) throw new Error('Program was not found');

        program = this.merge(program, input);

        return this.save(program);
    }

    async findProgram(id: number): Promise<Program> {
        let program = await this.findOne(id);
        if (!program) throw new Error('Program was not found');
        return program;
    }

    async findUniversityPrograms(universityId: number): Promise<Program[]> {
        return await this
            .createQueryBuilder('program')
            .innerJoin(SchoolProgram, "sp", "sp.programId = program.id")
            .innerJoin(School, "school", "school.id = sp.schoolId")
            .innerJoin(Branch, 'branch', 'branch.id = school.branchId')
            .where("branch.universityId = :universityId", {universityId})
            .getMany();
    }

    findPrograms() {
        return this.find({order: {id: 'DESC'}})
    }
}