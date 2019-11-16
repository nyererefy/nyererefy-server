import '../../utils/test/initTestDb'
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {SchoolRepository} from "./schoolRepository";
import {getCustomRepository} from "typeorm";
import {TEST_BRANCH_ID, TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: SchoolRepository;

beforeAll(async () => {
    repository = getCustomRepository(SchoolRepository);
});

describe('School', () => {
    it('should create a new schools basing on university\'s id', async () => {
        const result = await createSchool(TEST_BRANCH_ID);

        expect(result).toMatchObject({
            title: expect.any(String),
        })
    });

    it('should return schools and their schoolPrograms', async () => {
        const program = await createProgram();
        const school = await createSchool(TEST_BRANCH_ID);

        await registerProgram(school.id, program.id);

        const result = await repository.findSchools(TEST_UNIVERSITY_ID);

        expect(result).toContainEqual(
            expect.objectContaining({
                title: expect.any(String),
                schoolPrograms: expect.any(Array)
            })
        )
    });
});