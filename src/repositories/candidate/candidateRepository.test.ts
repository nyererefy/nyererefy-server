import '../../utils/test/initTestDb'
import {CandidateRepository} from "./candidateRepository";
import {getCustomRepository} from "typeorm";
import {CandidateEditInput, CandidateInput} from "../../entities/candidate";
import faker from 'faker';

let repository: CandidateRepository;
const userId = 2;
const candidateId = 1;
const categoryId = 1;

beforeEach(async () => {
    repository = getCustomRepository(CandidateRepository);
});

describe('CandidateRepository', () => {
    it('should create a new candidate', async () => {
        const input: CandidateInput = {
            userId,
            categoryId
        };
        const result = await repository.createCandidate(input);

        expect(result).toBeDefined()
    });

    it('should edit a candidate', async () => {

        const input: CandidateEditInput = {
            bio: faker.random.words(2),
        };
        const result = await repository.editCandidate(candidateId, input);

        await expect(result).toMatchObject(input)
    });

    it('should find candidate', async () => {
        const result = await repository.findCandidate(candidateId);
        expect(result).toBeDefined();
    });

    it('should find candidates', async () => {
        const results = await repository.findCandidates();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                uuid: expect.any(String)
            })
        )
    });
});