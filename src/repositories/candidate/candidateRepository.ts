import {EntityRepository, Repository} from "typeorm";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import {Category} from "../../entities/category";
import {Student} from "../../entities/student";

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
    async createCandidate(input: CandidateInput): Promise<Candidate> {
        //Associated student.
        const student = new Student();
        student.id = input.studentId;

        //Associated category.
        const category = new Category();
        category.id = input.categoryId;

        // Checking if student is already a candidate on the same category
        const result: [Candidate[], number] = await this.findAndCount({student, category});
        const count = result[1];

        if (count !== 0) {
            throw new Error('Student is already a candidate in this category!')
        }

        const candidate = this.create({student, category});

        return await this.save(candidate);
    }

    async editCandidate(id: number, input: CandidateEditInput) {
        let candidate = await this.findOne(id);

        if (!candidate) throw new Error('Candidate was not found');

        candidate = this.merge(candidate, input);

        return await this.save(candidate);
    }

    findCandidate(id: number) {
        return this.findOne(id)
    }

    findCandidates() {
        return this.find()
    }

}