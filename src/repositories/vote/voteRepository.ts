import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Vote, VoteInput} from "../../entities/vote";
import {User} from "../../entities/user";
import {CandidateRepository} from "../candidate/candidateRepository";
import {SubcategoryRepository} from "../subcategory/subcategoryRepository";
import {Subcategory} from "../../entities/subcategory";

interface VoteInterface {
    userId: number,
    input: VoteInput,
    ip?: string,
    device?: string
}

/**
 * Caching https://github.com/typeorm/typeorm/blob/master/docs/caching.md
 */
@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    private candidateRepository: CandidateRepository;
    private subcategoryRepository: SubcategoryRepository;

    constructor() {
        super();
        this.candidateRepository = getCustomRepository(CandidateRepository);
        this.subcategoryRepository = getCustomRepository(SubcategoryRepository);
    }

    async createVote({userId, input, ip, device}: VoteInterface): Promise<Vote> {
        //Voter.
        const user = new User();
        user.id = userId;

        let ip_guard: string | undefined;
        const candidate = await this.candidateRepository.findCandidateByUUID(input.uuid);
        const subcategoryToBeChecked = candidate.subcategory;
        const election = candidate.subcategory.category.election;

        //checking if election is open.
        if (!election.isOpen) {
            throw new Error('Election is not opened')
        }

        //Finding all eligible subcategories for this user.
        const subcategories = await this.subcategoryRepository.findEligibleElectionSubcategories(
            subcategoryToBeChecked.category.election.id,
            userId
        );

        //Checking if candidate subcategory exists in eligible subcategories.
        const subcategory = subcategories.find(o => o.id === subcategoryToBeChecked.id);

        //Throw error and take action
        if (!subcategory) {
            //todo ban this user.
            throw new Error('You will get banned soon')
        }

        //If election is in strict mode.
        if (election.isStrict && ip) {
            ip_guard = `${ip}-${subcategory.id}`
        }

        // Checking if user has already voted
        const result: [Vote[], number] = await this.findAndCount({user, subcategory});
        const count = result[1];

        if (count !== 0) {
            throw new Error('Ooops! You have already voted in this category!')
        }

        const guard = parseInt(`${user.id}${candidate.subcategory.id}`);

        const vote = this.create({user, subcategory, candidate, guard, ip, ip_guard, device});

        return await this.save(vote);
    }

    findSubcategoryVotes(subcategoryId: number) {
        const subcategory = new Subcategory();
        subcategory.id = subcategoryId;

        return this.find({where: {subcategory}})
    }

}