import {EntityRepository, Repository} from "typeorm";
import {School, SchoolInput} from "../../entities/school";
import {Branch} from "../../entities/branch";
import {University} from "../../entities/university";

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
    async createSchool(universityId: number, input: SchoolInput): Promise<School> {
        const school = new School();

        school.title = input.title;
        school.abbreviation = input.abbreviation;
        school.identifier = input.identifier;

        //University
        const university = new University();
        university.id = universityId;

        school.university = university;

        //Save branch if exists.
        const branchId = input.branchId;
        if (branchId) {
            const branch = new Branch();
            branch.id = branchId;

            school.branch = branch;
        }

        return await this.save(school);
    }

    editSchool(input: SchoolInput) {
        const school = this.create(input);
        return this.save(school);
    }

    findSchool(id: number) {
        return this.findOne(id);
    }

    findSchools() {
        return this.find();
    }
}