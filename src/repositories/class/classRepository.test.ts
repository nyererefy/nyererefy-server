import '../../utils/test/initTestDb'
import {ClassRepository} from "./classRepository";
import {getCustomRepository} from "typeorm";
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {Duration} from "../../utils/enums";
import {TEST_BRANCH_ID} from "../../utils/consts";

let repository: ClassRepository;

beforeAll(async () => {
    repository = getCustomRepository(ClassRepository);
});

describe('Class', () => {
    it('should create a classes for all years', async () => {
        const program = await createProgram(Duration.FOUR_YEARS, 'BPHARM');
        const school = await createSchool(TEST_BRANCH_ID, 'School of Pharmacy');

        await registerProgram(school.id, program.id);

        const results = await repository.generateClasses(1);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                abbreviation: expect.any(String)
            })
        )
    });

    it('should update classes for all years', async () => {
        const program = await createProgram(Duration.THREE_YEARS, 'BMLS');
        const school = await createSchool(TEST_BRANCH_ID, 'Lab School');
        await registerProgram(school.id, program.id);

        const results = await repository.generateClasses(1);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                abbreviation: expect.any(String)
            })
        )
    });

});