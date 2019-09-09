import '../../utils/test/initTestDb'
import {ClassRepository} from "./classRepository";
import {getCustomRepository} from "typeorm";
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {Duration} from "../../utils/enums";
import {Program} from "../../entities/program";
import {School} from "../../entities/school";

let repository: ClassRepository;
let program: Program;
let school: School;

beforeAll(async () => {
    repository = getCustomRepository(ClassRepository);

    program = await createProgram(Duration.THREE_YEARS);

    school = await createSchool(1);

    await registerProgram(school.id, program.id);
});

describe('Class', () => {
    it('should create a classes for all years', async () => {
        const results = await repository.generateClasses(1, school.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                abbreviation: expect.any(String)
            })
        )
    });

    it('should update classes for all years', async () => {
        const results = await repository.generateClasses(1, school.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                abbreviation: expect.any(String)
            })
        )
    });

});