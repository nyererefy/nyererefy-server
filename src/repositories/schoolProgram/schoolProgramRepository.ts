import {EntityRepository, Repository} from "typeorm";
import {Program} from "../../entities/program";
import {SchoolProgram, SchoolProgramInput} from "../../entities/schoolProgram";
import {School} from "../../entities/school";

@EntityRepository(SchoolProgram)
export class SchoolProgramRepository extends Repository<SchoolProgram> {

    async registerProgram(input: SchoolProgramInput): Promise<SchoolProgram> {
        const school = new School();
        school.id = input.schoolId;

        const program = new Program();
        program.id = input.programId;

        let schoolProgram = await this.findOne({where: {school, program}});
        if (schoolProgram) {
            throw new Error('Program is already registered')
        }

        schoolProgram = new SchoolProgram();
        schoolProgram.program = program;
        schoolProgram.school = school;
        schoolProgram.identifier = input.identifier;

        return this.save(schoolProgram);
    }

    async findSchoolProgram(universityId: number, identifier: string): Promise<SchoolProgram> {
        const sp = await this.createQueryBuilder('sp')
            .innerJoinAndSelect('sp.program', 'program')
            .innerJoinAndSelect('sp.school', 'school')
            .innerJoin('school.branch', 'branch')
            .where('sp.identifier = :identifier', {identifier})
            .andWhere('branch.university = :universityId', {universityId})
            .getOne();

        if (sp) return sp;

        throw new Error('Class not found')
    }
}