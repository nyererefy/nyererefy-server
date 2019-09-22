import '../../utils/test/initTestDb'
import {CandidateRepository} from "./candidateRepository";
import {getCustomRepository} from "typeorm";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import faker from 'faker';
import {createCandidate, createUser} from "../../utils/test/initDummyData";

let repository: CandidateRepository;
let candidate: Candidate;
const subcategoryId = 1;

beforeAll(async () => {
    repository = getCustomRepository(CandidateRepository);
    const user = await createUser(1);
    candidate = await createCandidate(user.id, 1)
});

describe('CandidateRepository', () => {
    it('should create a new candidate', async () => {
        const user = await createUser(1);

        const input: CandidateInput = {
            userId: user.id,
            subcategoryId
        };
        const result = await repository.createCandidate(input);

        expect(result).toBeDefined()
    });

    it('should edit a candidate', async () => {

        const input: CandidateEditInput = {
            bio: faker.random.words(2),
        };
        const result = await repository.editCandidate(candidate.id, input);

        await expect(result).toMatchObject(input)
    });

    it('should find candidate', async () => {
        const result = await repository.findCandidate(candidate.id);
        expect(result).toBeDefined();
    });

    it('should find candidate by uuid', async () => {
        const result = await repository.findCandidateByUUID(candidate.uuid);

        expect(result).toMatchObject({
            uuid: expect.any(String),
            subcategory: {
                id: expect.any(Number),
                category: {
                    id: expect.any(Number),
                    election: {
                        id: expect.any(Number)
                    }
                }
            }
        });
    });

    it('should find candidates', async () => {
        const results = await repository.findCandidates(subcategoryId);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                uuid: expect.any(String)
            })
        )
    });
});