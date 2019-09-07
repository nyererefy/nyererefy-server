import {EntityRepository, Repository} from "typeorm";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import {Subcategory} from "../../entities/subcategory";
import {User} from "../../entities/user";

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
    async createCandidate(input: CandidateInput): Promise<Candidate> {
        //Associated user.
        const user = new User();
        user.id = input.userId;

        //Associated subcategory.
        const subcategory = new Subcategory();
        subcategory.id = input.subcategoryId;

        // Checking if user is already a candidate on the same subcategory
        const result: [Candidate[], number] = await this.findAndCount({user, subcategory});
        const count = result[1];

        if (count !== 0) {
            throw new Error('User is already a candidate in this subcategory!')
        }

        const candidate = this.create({user, subcategory});

        return await this.save(candidate);
    }

    async editCandidate(id: number, input: CandidateEditInput) {
        let candidate = await this.findOne(id);

        if (!candidate) throw new Error('Candidate was not found');

        candidate = this.merge(candidate, input);

        return await this.save(candidate);
    }

    async findCandidate(id: number) {
        let candidate = await this.findOne(id);

        if (!candidate) throw new Error('Candidate was not found');
        return candidate;
    }

    async findCandidateByUUID(uuid: string) {
        let candidate = await this.findOne({where: {uuid}, relations: ['subcategory']});

        if (!candidate) throw new Error('Candidate was not found');
        return candidate;
    }

    findCandidates() {
        return this.find()
    }

}