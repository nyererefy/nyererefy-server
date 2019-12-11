import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {GetVotesArgs, Vote, VoteInput} from "../../entities/vote";
import {User} from "../../entities/user";
import {CandidateRepository} from "../candidate/candidateRepository";
import {SubcategoryRepository} from "../subcategory/subcategoryRepository";
import {Subcategory} from "../../entities/subcategory";
import {Candidate} from "../../entities/candidate";
import {
    CACHE_CANDIDATE_VOTES_COUNT_ID,
    CACHE_MID_TIME,
    CACHE_SUBCATEGORY_VOTES_COUNT_ID,
    CACHE_VOTE_ID
} from "../../utils/consts";
import {OrderBy} from "../../utils/enums";
import {UserRepository} from "../user/userRepository";
import {notifyUser} from "../../helpers/notification";

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
    private userRepository: UserRepository;

    constructor() {
        super();
        this.candidateRepository = getCustomRepository(CandidateRepository);
        this.subcategoryRepository = getCustomRepository(SubcategoryRepository);
        this.userRepository = getCustomRepository(UserRepository);
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

        //Verifying user pin
        await this.userRepository.verifyPassword(userId, input.pin);

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

        let vote = this.create({user, subcategory, candidate, guard, ip, ip_guard, device});

        try {
            vote = await this.save(vote);

            try {
                //Removing candidate's votes count from cache as well as subcategory's
                await this.manager.connection.queryResultCache!.remove([
                    `${CACHE_SUBCATEGORY_VOTES_COUNT_ID}:${subcategory.id}`,
                    `${CACHE_CANDIDATE_VOTES_COUNT_ID}:${candidate.id}`
                ]);
            } catch (e) {
                console.error(e) //todo winston.
            }
        } catch (e) {
            throw new Error('Ooops! Something went wrong!');
        }

        //Notify user
        await notifyUser({
                userId,
                title: `You have successfully voted for ${candidate.user.name}`,
                body: "Thank you"
            }
        );

        return vote;
    }

    /**
     * We are caching result so as it wont slow us down in subscription.
     * @param voteId
     */
    async findVote(voteId: number): Promise<Vote> {
        const vote = await this.findOne(voteId, {
            cache: {
                id: `${CACHE_VOTE_ID}:${voteId}`,
                milliseconds: CACHE_MID_TIME
            }
        });

        if (!vote) throw new Error('Vote was not found');

        return vote;
    }

    findSubcategoryVotes({subcategoryId, offset = 0, limit = 10, orderBy = OrderBy.DESC}: GetVotesArgs) {
        return this.createQueryBuilder('vote')
            .where('vote.subcategory = :subcategoryId', {subcategoryId})
            .limit(limit)
            .offset(offset)
            .orderBy('vote.id', orderBy)
            .cache({
                id: `${CACHE_SUBCATEGORY_VOTES_COUNT_ID}:${subcategoryId}`,
                milliseconds: CACHE_MID_TIME
            })
            .getMany();
    }

    countCandidateVotes(candidateId: number): Promise<number> {
        const candidate = new Candidate();
        candidate.id = candidateId;

        return this.count({
            where: {candidate},
            cache: {
                id: `${CACHE_CANDIDATE_VOTES_COUNT_ID}:${candidateId}`,
                milliseconds: CACHE_MID_TIME
            }
        });
    }

    countSubcategoryVotes(subcategoryId: number): Promise<number> {
        const subcategory = new Subcategory();
        subcategory.id = subcategoryId;

        return this.count({
            where: {subcategory},
            cache: {
                id: `${CACHE_SUBCATEGORY_VOTES_COUNT_ID}:${subcategoryId}`,
                milliseconds: 10 * 60 * 1000 //10 minutes
            }
        });
    }
}