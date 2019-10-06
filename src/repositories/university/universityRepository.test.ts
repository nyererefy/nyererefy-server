import '../../utils/test/initTestDb'
import {UniversityRepository} from "./universityRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {UniversityEditInput} from "../../entities/university";
import {createUniversity} from "../../utils/test/initDummyData";

let repository: UniversityRepository;

beforeEach(async () => {
    repository = getCustomRepository(UniversityRepository);
});

describe('University', () => {
    it('should create a new university', async () => {
        const result = await createUniversity();

        expect(result).toMatchObject({
            id: expect.any(Number)
        })
    });

    it('should edit an university', async () => {
        const id = 1;

        const input: UniversityEditInput = {
            email: faker.internet.email(),
            title: faker.lorem.sentence(),
            abbreviation: faker.random.word(),
            webUrl: faker.internet.url(),
            bridgeUrl: faker.internet.url(),
            semesterStartsIn: 10,
            semesterEndsIn: 8
        };
        const result = await repository.editUniversity(1, input);

        await expect(result).toMatchObject({
            id,
            title: input.title
        })
    });

    it('should find university', async () => {
        const electionId = 1;
        const result = await repository.findUniversity(electionId);
        expect(result).toBeDefined();
    });

    it('should find university\'s schools and programs', async () => {
        const electionId = 1;
        const result = await repository.findUniversityAndSchoolAndPrograms(electionId);
        // console.log('branches', result.branches);
        // console.log('schools', result.branches[0].schools);
        // console.log('schoolPrograms', result.branches[0].schools[0].schoolPrograms);
        // console.log('program', result.branches[0].schools[0].schoolPrograms[0].program);
        expect(result).toBeDefined();
    });

    it('should find universities', async () => {
        const results = await repository.findUniversities();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should validate university', async () => {
        const university = await createUniversity();
        const result = await repository.validateUniversity(university.uuid, university.secret);

        expect(result).toBeTruthy();
    });

    it('should  fail to validate university', async () => {
        const university = await createUniversity();
        await repository.regenerateSecret(university.id);

        try {
            await repository.validateUniversity(university.uuid, university.secret);
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e.message).toMatch(/Invalid/);
        }
    });

    it('should  regenerate Secret', async () => {
        const university = await createUniversity();
        const secret = await repository.regenerateSecret(university.id);
        const result = await repository.findUniversity(university.id);

        expect(result.secret).toMatch(secret)
    });
});