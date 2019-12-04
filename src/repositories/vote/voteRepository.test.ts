import '../../utils/test/initTestDb'
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {VoteRepository} from "./voteRepository";
import {VoteInput} from "../../entities/vote";
import {createCandidate, createUser, setUserAccount} from "../../utils/test/initDummyData";
import {Candidate} from "../../entities/candidate";
import {
    TEST_CATEGORY_ID,
    TEST_ELECTION_ID,
    TEST_PASSWORD,
    TEST_PROGRAM_IDENTIFIER,
    TEST_VOTER_ID
} from "../../utils/consts";
import {ElectionRepository} from "../election/electionRepository";

let voteRepository: VoteRepository;
let electionRepository: ElectionRepository;
let candidate1: Candidate;
let candidate2: Candidate;
let input1: VoteInput;
let input2: VoteInput;

beforeAll(async () => {
    voteRepository = getCustomRepository(VoteRepository);
    electionRepository = getCustomRepository(ElectionRepository);

    //Opening election.
    await electionRepository.openElection(TEST_ELECTION_ID);

    candidate1 = await createCandidate(2, TEST_CATEGORY_ID);
    candidate2 = await createCandidate(3, 2);

    //Setting up voter's account
    const setInput = await setUserAccount(TEST_VOTER_ID);

    input1 = {uuid: candidate1.uuid, pin: setInput.pin};
    input2 = {uuid: candidate2.uuid, pin: setInput.pin};
});

describe('Vote', () => {
    it('should create a new vote', async () => {
        const vote = await voteRepository.createVote({
            userId: TEST_VOTER_ID,
            input: input1,
            device: faker.random.words(2),
            ip: faker.internet.ip()
        });

        expect(vote.candidate.id).toEqual(candidate1.id);
        expect(vote.subcategory.id).toEqual(candidate1.subcategory.id);

        expect(vote).toMatchObject({
            candidate: {id: candidate1.id},
            user: {id: TEST_VOTER_ID}
        });
    }, 10000);

    it('should vote for second subcategory', async () => {
        const result2 = await voteRepository.createVote({
            userId: TEST_VOTER_ID,
            input: input2,
            device: faker.random.words(2),
            ip: faker.internet.ip()
        });

        expect(result2).toMatchObject({
            candidate: {id: candidate2.id},
            user: {id: TEST_VOTER_ID}
        });
    }, 10000);

    it('should count candidate\'s votes', async function () {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);
        const candidate = await createCandidate(user.id, 2);

        const input = {uuid: candidate.uuid, password: TEST_PASSWORD};

        const result = await voteRepository.createVote({
            userId: user.id,
            input: input,
            device: faker.random.words(2),
            ip: faker.internet.ip()
        });

        expect(result).toMatchObject({
            candidate: {id: candidate.id},
            user: {id: user.id}
        });

        const count = await voteRepository.countCandidateVotes(candidate.id);

        expect(count).toEqual(1)
    });
});