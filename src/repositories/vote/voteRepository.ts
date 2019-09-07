import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Vote, VoteInput} from "../../entities/vote";
import {User} from "../../entities/user";
import {CandidateRepository} from "../candidate/candidateRepository";

/**
 * Caching https://github.com/typeorm/typeorm/blob/master/docs/caching.md
 */
@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    private candidateRepository: CandidateRepository;

    constructor() {
        super();
        this.candidateRepository = getCustomRepository(CandidateRepository)
    }

    async createVote(userId: number, input: VoteInput, ip?: string): Promise<Vote> {
        //Voter.
        const user = new User();
        user.id = userId;

        const candidate = await this.candidateRepository.findCandidateByUUID(input.uuid);
        const category = candidate.category;

        const guard = parseInt(`${user.id}${candidate.category.id}`);

        // Checking if user has already voted
        const result: [Vote[], number] = await this.findAndCount({user, category});
        const count = result[1];

        if (count !== 0) {
            throw new Error('You already voted in this category!')
        }

        const vote = this.create({user, category, candidate, guard, ip});

        return await this.save(vote);
    }

    findVote(id: number) {
        return this.findOne(id)
    }

    findVotes() {
        return this.find()
    }

}