import '../../utils/test/initTestDb'
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {getCustomRepository} from "typeorm";
import {SchoolProgramRepository} from "./schoolProgramRepository";
import {TEST_BRANCH_ID, TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: SchoolProgramRepository;

beforeAll(async () => {
    repository = getCustomRepository(SchoolProgramRepository);
});

describe('Program', () => {
    it('should register a new program to a university', async () => {
        const school = await createSchool(TEST_BRANCH_ID);
        const program = await createProgram();

        const result = await registerProgram(school.id, program.id);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });
    });

    it('should find registered school program', async () => {
        const result = await repository.findSchoolProgram(TEST_UNIVERSITY_ID, TEST_PROGRAM_IDENTIFIER);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });
    });

    it('should delete registered school program', async () => {
        const school = await createSchool(TEST_BRANCH_ID);
        const program = await createProgram();
        const sp = await registerProgram(school.id, program.id);

        const result = await repository.deleteSchoolProgram(sp.id, TEST_UNIVERSITY_ID);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });

        const deleted = await repository.findOne(sp.id);
        expect(deleted).toBe(undefined);
    });

});