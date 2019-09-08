import '../../utils/test/initTestDb'
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {SchoolRepository} from "./schoolRepository";
import {getCustomRepository} from "typeorm";

let repository: SchoolRepository;

beforeAll(async () => {
    repository = getCustomRepository(SchoolRepository);
});

describe('School', () => {
    it('should create a new schools basing on university\'s id', async () => {
        const result = await createSchool(1);

        expect(result).toMatchObject({
            title: expect.any(String),
            university: {id: 1}
        })
    });

    it('should return school and it\'s schoolPrograms', async () => {
        const program = await createProgram();
        await registerProgram(1, program.id);

        const result = await repository.findSchoolAndPrograms(1);
        //todo test fresh
        expect(result).toMatchObject({
            title: expect.any(String),
            programs: expect.any(Array)
        })
    });
});