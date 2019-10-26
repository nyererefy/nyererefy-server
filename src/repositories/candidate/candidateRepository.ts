import {EntityRepository, Repository} from "typeorm";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import {Subcategory} from "../../entities/subcategory";
import {User} from "../../entities/user";

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
    async createCandidate(input: CandidateInput): Promise<Candidate> {
        //Todo checking if user shares any eligibility with category, otherwise admin should enable isAbnormal
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

    async editCandidate(userId: number, input: CandidateEditInput) {
        const user = new User();
        user.id = userId;

        let candidate = await this.findOne({
            where: {
                id: input.id,
                user
            }
        });

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
        const candidate = await this.createQueryBuilder('candidate')
            .innerJoinAndSelect('candidate.subcategory', 'subcategory')
            .innerJoinAndSelect('subcategory.category', 'category')
            .innerJoinAndSelect('category.election', 'election')
            .where("candidate.uuid = :uuid", {uuid})
            .getOne();

        if (!candidate) throw new Error('Candidate was not found');
        return candidate;
    }

    findCandidates(subcategoryId: number) {
        const subcategory = new Subcategory();
        subcategory.id = subcategoryId;

        return this.find({where: {subcategory}})
    }

    async findCandidatesAndCountVotes(subcategoryId: number): Promise<Candidate[]> {
        return await this.createQueryBuilder('candidate')
            .innerJoinAndSelect('candidate.user', 'user')
            .where("candidate.subcategoryId = :subcategoryId", {subcategoryId})
            .loadRelationCountAndMap('candidate.votesCount', 'candidate.votes')
            .getMany()
    }

    async findCandidateAndCountVotes(candidateId: number): Promise<Candidate> {
        const candidate = await this.createQueryBuilder('candidate')
            .innerJoinAndSelect('candidate.user', 'user')
            .where("candidate.id = :candidateId", {candidateId})
            .loadRelationCountAndMap('candidate.votesCount', 'candidate.votes')
            .getOne();

        if (candidate) return candidate;

        throw new Error('Candidate was not found')
    }
}