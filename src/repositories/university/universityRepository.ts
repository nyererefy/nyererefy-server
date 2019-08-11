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

    findUniversity(id: number) {
        return this.findOne(id)
    }

    findUniversities() {
        return this.find()
    }
}