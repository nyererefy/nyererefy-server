import {EntityRepository, Repository} from "typeorm";
import {School, SchoolInput} from "../../entities/school";
import {Branch} from "../../entities/branch";
import {University} from "../../entities/university";

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
    async createSchool(input: SchoolInput): Promise<School> {
        const school = new School();

        school.title = input.title;
        school.abbreviation = input.abbreviation;
        school.identifier = input.identifier;

        const branch = new Branch();
        branch.id = input.branchId;

        school.branch = branch;

        return await this.save(school);
    }

    async findSchoolAndPrograms(id: number) {
        let school = await this.findOne(id, {relations: ['schoolPrograms']});
        if (!school) throw new Error('School was not found');

        return school;
    }

    findSchools(universityId: number) {
        const university = new University();
        university.id = universityId;

        return this.find({where: {university}});
    }
}