import '../../utils/test/initTestDb'
import {ElectionRepository} from "./electionRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {ElectionEditInput, ElectionInput} from "../../entities/election";

let repository: ElectionRepository;

beforeEach(async () => {
    repository = getCustomRepository(ElectionRepository);
});

describe('Election', () => {
    it('should create a new election', async () => {
        const universityId = 1;

        const input: ElectionInput = {
            title: faker.lorem.sentence()
        };
        const result = await repository.createElection(universityId, input);

        expect(result.title).toMatch(input.title)
    });

    it('should edit an election', async () => {
        const id = 1;
        const input: ElectionEditInput = {
            title: faker.lorem.sentence()
        };
        const result = await repository.editElection(1, input);

        await expect(result).toMatchObject({
            id,
            title: input.title
        })
    });

    it('should find election', async () => {
        const electionId = 1;
        const result = await repository.findElection(electionId);
        expect(result).toBeDefined();
    });

    it('should find election and its categories', async () => {
        const electionId = 1;
        const result = await repository.findElectionCategories(electionId);

        expect(result!.categories).toContainEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String)
            })
        )
    });

    it('should find elections', async () => {
        const results = await repository.findElections();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});