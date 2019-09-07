import '../../utils/test/initTestDb'
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {VoteRepository} from "./voteRepository";
import {VoteInput} from "../../entities/vote";
import {createCandidate} from "../../utils/test/initDummyData";
import {Candidate} from "../../entities/candidate";
import {TEST_CATEGORY_ID, TEST_VOTER_ID} from "../../utils/consts";

let repository: VoteRepository;
let candidate: Candidate;
let input: VoteInput;

beforeAll(async () => {
    repository = getCustomRepository(VoteRepository);

    candidate = await createCandidate(2, TEST_CATEGORY_ID);

    input = {
        uuid: candidate.uuid,
        device: faker.random.words(2)
    };
});

describe('Vote', () => {
    it('should create a new vote and fail to vote twice', async () => {
        const result = await repository.createVote(TEST_VOTER_ID, input);

        expect(result).toMatchObject({
            candidate: {id: candidate.id},
            user: {id: TEST_VOTER_ID}
        });

        // expect(async () => {
        //     await repository.createVote(TEST_VOTER_ID, input);
        // }).toThrowError(/voted/);
    });
});