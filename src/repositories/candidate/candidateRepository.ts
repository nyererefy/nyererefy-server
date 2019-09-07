import {EntityRepository, Repository} from "typeorm";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import {Category} from "../../entities/category";
import {User} from "../../entities/user";

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
    async createCandidate(input: CandidateInput): Promise<Candidate> {
        //Associated user.
        const user = new User();
        user.id = input.userId;

        //Associated category.
        const category = new Category();
        category.id = input.categoryId;

        // Checking if user is already a candidate on the same category
        const result: [Candidate[], number] = await this.findAndCount({user, category});
        const count = result[1];

        if (count !== 0) {
            throw new Error('User is already a candidate in this category!')
        }

        const candidate = this.create({user, category});

        return await this.save(candidate);
    }

    async editCandidate(id: number, input: CandidateEditInput) {
        let candidate = await this.findOne(id);

        if (!candidate) throw new Error('Candidate was not found');

        candidate = this.merge(candidate, input);

        return await this.save(candidate);
    }

    async findCandidateByUUID(uuid: string) {
        let candidate = await this.findOne({where: {uuid}, relations: ['category']});

        if (!candidate) throw new Error('Candidate was not found');
        return candidate;
    }

    findCandidates() {
        return this.find()
    }

}