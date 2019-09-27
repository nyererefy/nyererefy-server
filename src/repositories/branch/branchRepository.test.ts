import '../../utils/test/initTestDb'
import {BranchRepository} from "./branchRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {BranchInput} from "../../entities/branch";
import {createBranch} from "../../utils/test/initDummyData";
import {TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: BranchRepository;

beforeEach(async () => {
    repository = getCustomRepository(BranchRepository);
});

describe('Branch', () => {
    it('should create a new branch', async () => {

        const result = await createBranch(1);

        expect(result).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String)
        });
    });

    it('should edit an branch', async () => {
        const id = 1;

        const input: BranchInput = {
            title: faker.lorem.sentence(),
            abbreviation: faker.random.word(),
        };
        const result = await repository.editBranch(1, input);

        await expect(result).toMatchObject({
            id,
            title: input.title
        })
    });

    it('should find branch', async () => {
        const electionId = 1;
        const result = await repository.findBranch(electionId);
        expect(result).toBeDefined();
    });

    it('should find elections', async () => {
        const results = await repository.findUniversityBranches(TEST_UNIVERSITY_ID);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});