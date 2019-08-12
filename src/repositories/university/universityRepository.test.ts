import '../../utils/test/initTestDb'
import {UniversityRepository} from "./universityRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {UniversityEditInput, UniversityInput} from "../../entities/university";

let repository: UniversityRepository;

beforeEach(async () => {
    repository = getCustomRepository(UniversityRepository);
});

describe('University', () => {
    it('should create a new university', async () => {
        const input: UniversityInput = {
            email: faker.internet.email(),
            title: faker.company.companyName(),
            abbreviation: faker.lorem.word(),
            webUrl: faker.internet.url(),
            bridgeUrl: faker.internet.url(),
        };
        const result = await repository.createUniversity(input);

        expect(result).toMatchObject(input)
    });

    it('should edit an election', async () => {
        const id = 1;

        const input: UniversityEditInput = {
            email: faker.internet.email(),
            title: faker.lorem.sentence(),
            abbreviation: faker.lorem.word(),
            webUrl: faker.internet.url(),
            bridgeUrl: faker.internet.url(),
        };
        const result = await repository.editUniversity(1, input);

        await expect(result).toMatchObject({
            id,
            title: input.title
        })
    });

    it('should find election', async () => {
        const electionId = 1;
        const result = await repository.findUniversity(electionId);
        expect(result).toBeDefined();
    });

    it('should find elections', async () => {
        const results = await repository.findUniversities();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});