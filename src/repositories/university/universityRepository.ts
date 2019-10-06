import {EntityRepository, Repository} from "typeorm";
import {University, UniversityEditInput, UniversityInput} from "../../entities/university";
import {Branch} from "../../entities/branch";
import cryptoRandomString from "crypto-random-string";

@EntityRepository(University)
export class UniversityRepository extends Repository<University> {
    createUniversity(input: UniversityInput) {
        const university = this.create(input);

        university.secret = cryptoRandomString({length: 64});

        //default branch..
        const branch = new Branch();
        branch.title = "Main";
        university.branches = [branch];

        return this.save(university);
    }

    async editUniversity(id: number, input: UniversityEditInput) {
        let university = await this.findOne(id);
        if (!university) throw new Error('University was not found');

        university = this.merge(university, input);

        return this.save(university);
    }

    async regenerateSecret(id: number): Promise<string> {
        let university = await this.findOne(id);
        if (!university) throw new Error('University was not found');

        const secret = cryptoRandomString({length: 64});

        await this.update(university.id, {secret});

        return secret;
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

    async validateUniversity(uuid: string, secret: string): Promise<boolean> {
        let university = await this.findUniversityByUUId(uuid);

        if (university.secret === secret) return true;

        throw new Error('Invalid university/college credentials')
    }

    findUniversities() {
        return this.find()
    }
}