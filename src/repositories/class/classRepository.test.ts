import '../../utils/test/initTestDb'
import {ClassRepository} from "./classRepository";
import {getCustomRepository} from "typeorm";
import {createProgram, createSchool, registerProgram} from "../../utils/test/initDummyData";
import {Duration} from "../../utils/enums";

let repository: ClassRepository;

beforeAll(async () => {
    repository = getCustomRepository(ClassRepository);
});

describe('Class', () => {
    it('should create a classes for all years', async () => {
        const program = await createProgram(Duration.THREE_YEARS);

        const school = await createSchool(1);
        await registerProgram(school.id, program.id);
        const results = await repository.generateClasses(school.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                abbreviation: expect.any(String)
            })
        )
    });

});