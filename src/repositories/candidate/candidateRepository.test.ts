import '../../utils/test/initTestDb'
import {CandidateRepository} from "./candidateRepository";
import {getCustomRepository} from "typeorm";
import {CandidateEditInput, CandidateInput} from "../../entities/candidate";
import faker from 'faker';

let repository: CandidateRepository;
const id = 1; //Id to test

beforeEach(async () => {
    repository = getCustomRepository(CandidateRepository);
});

describe('CandidateRepository', () => {
    it('should create a new candidate', async () => {
        const input: CandidateInput = {
            studentId: 2,
            categoryId: 1
        };
        const result = await repository.createCandidate(input);

        expect(result).toBeDefined()
    });

    it('should edit a candidate', async () => {

        const input: CandidateEditInput = {
            bio: faker.random.words(2),
        };
        const result = await repository.editCandidate(id, input);

        await expect(result).toMatchObject(input)
    });

    it('should find candidate', async () => {
        const result = await repository.findCandidate(id);
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