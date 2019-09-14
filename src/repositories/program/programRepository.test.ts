import '../../utils/test/initTestDb'
import {ProgramRepository} from "./programRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {ProgramInput} from "../../entities/program";
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {Duration} from "../../utils/enums";
import {TEST_BRANCH_ID, TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: ProgramRepository;

beforeEach(async () => {
    repository = getCustomRepository(ProgramRepository);
});

describe('Program', () => {
    it('should create a new program', async () => {

        const result = await createProgram();

        expect(result).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String)
        });
    });

    it('should edit an program', async () => {
        const id = 1;

        const input: ProgramInput = {
            title: faker.lorem.sentence(),
            abbreviation: faker.random.word(),
            duration: Duration.THREE_YEARS
        };
        const result = await repository.editProgram(1, input);

        await expect(result).toMatchObject({
            id,
            title: input.title
        })
    });

    it('should find program', async () => {
        const electionId = 1;
        const result = await repository.findProgram(electionId);
        expect(result).toBeDefined();
    });

    it('should find schoolPrograms', async () => {
        const results = await repository.findPrograms();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should find all university Programs', async () => {
        const pg1 = await createProgram();
        const pg2 = await createProgram();
        const sc1 = await createSchool(TEST_BRANCH_ID);
        const sc2 = await createSchool(TEST_BRANCH_ID);

        await registerProgram(sc1.id, pg1.id);
        await registerProgram(sc1.id, pg2.id);
        await registerProgram(sc2.id, pg1.id);
        await registerProgram(sc2.id, pg2.id);

        const results = await repository.findUniversityPrograms(TEST_UNIVERSITY_ID);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});