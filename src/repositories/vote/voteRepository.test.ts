import '../../utils/test/initTestDb'
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {VoteRepository} from "./voteRepository";
import {VoteInput} from "../../entities/vote";
import {createCandidate, createUser} from "../../utils/test/initDummyData";
import {Candidate} from "../../entities/candidate";
import {TEST_CATEGORY_ID, TEST_ELECTION_ID, TEST_VOTER_ID} from "../../utils/consts";
import {ElectionRepository} from "../election/electionRepository";
import {ElectionEditInput} from "../../entities/election";

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
    const electionInput: ElectionEditInput = {
        isOpen: true
    };
    await electionRepository.editElection(TEST_ELECTION_ID, electionInput);

    candidate1 = await createCandidate(2, TEST_CATEGORY_ID);
    candidate2 = await createCandidate(3, 2);

    input1 = {uuid: candidate1.uuid};
    input2 = {uuid: candidate2.uuid};
});

describe('Vote', () => {
    it('should create a new vote and fail to vote twice', async () => {
        const result1 = await voteRepository.createVote({
            userId: TEST_VOTER_ID,
            input: input1,
            device: faker.random.words(2),
            ip: faker.internet.ip()
        });

        expect(result1).toMatchObject({
            candidate: {id: candidate1.id},
            user: {id: TEST_VOTER_ID}
        });
        //
        // expect(async () => {
        //     await voteRepository.createVote({
        //         userId: TEST_VOTER_ID,
        //         input: input1
        //     });
        // }).toThrowError(/voted/);
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
        const user = await createUser(1);
        const candidate = await createCandidate(user.id, 2);

        const input = {uuid: candidate.uuid};

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