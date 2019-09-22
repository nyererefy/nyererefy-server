import {EntityRepository, Repository} from "typeorm";
import {University, UniversityEditInput, UniversityInput} from "../../entities/university";

@EntityRepository(University)
export class UniversityRepository extends Repository<University> {
    createUniversity(input: UniversityInput) {
        const university = this.create(input);

        return this.save(university);
    }

    async editUniversity(id: number, input: UniversityEditInput) {
        let university = await this.findOne(id);
        if (!university) throw new Error('University was not found');

        university = this.merge(university, input);

        return this.save(university);
    }

    async findUniversity(id: number): Promise<University> {
        let university = await this.findOne(id);
        if (!university) throw new Error('University was not found');
        return university;
    }

    async findUniversityAndSchoolAndPrograms(universityId: number): Promise<University> {
        let university = await this
            .createQueryBuilder('university')
            .innerJoinAndSelect('university.branches', 'branch')
            .innerJoinAndSelect('branch.schools', 'school')
            .innerJoinAndSelect('school.schoolPrograms', 'schoolProgram')
            .innerJoinAndSelect('schoolProgram.program', 'program')
            .where("university.id = :universityId", {universityId})
            .getOne();

        if (!university) throw new Error('University was not found');
        return university;
    }

    async findUniversityByUUId(uuid: string): Promise<University> {
        let university = await this.findOne({where: {uuid}});
        if (!university) throw new Error('University was not found');
        return university;
    }

    findUniversities() {
        return this.find()
    }
}