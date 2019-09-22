import '../../utils/test/initTestDb'
import {createProgram, registerProgram} from "../../utils/test/initDummyData";
import {getCustomRepository} from "typeorm";
import {SchoolProgramRepository} from "./schoolProgramRepository";
import {TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: SchoolProgramRepository;

beforeAll(async () => {
    repository = getCustomRepository(SchoolProgramRepository);
});

describe('Program', () => {
    it('should register a new program to a university', async () => {
        const program = await createProgram();

        const result = await registerProgram(1, program.id);

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
});