import '../../utils/test/initTestDb'
import {ResidenceRepository} from "./residenceRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {Residence, ResidenceInput} from "../../entities/residence";
import {TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: ResidenceRepository;

let input: ResidenceInput;

beforeEach(async () => {
    repository = getCustomRepository(ResidenceRepository);

    input = {
        title: faker.lorem.word()
    };
});

async function createResidence(): Promise<Residence> {
    return await repository.createResidence(TEST_UNIVERSITY_ID, input);
}

describe('Residence', () => {
    it('should create a new residence', async () => {
        const residence = await createResidence();
        expect(residence.title).toMatch(input.title)
    });

    it('should edit an residence', async () => {
        const residence = await repository.createResidence(TEST_UNIVERSITY_ID, {
            title: "title"
        });
        const result = await repository.editResidence(residence.id, TEST_UNIVERSITY_ID, input);

        await expect(result).toMatchObject({
            id: residence.id,
            title: input.title
        })
    });

    it('should find residence', async () => {
        const residence = await createResidence();
        const result = await repository.findResidence(residence.id);

        await expect(result).toMatchObject({
            id: residence.id,
            title: residence.title
        })
    });

    it('should delete residence', async () => {
        const residence = await createResidence();
        const result = await repository.deleteResidence(residence.id, TEST_UNIVERSITY_ID);

        await expect(result).toMatchObject({
            id: residence.id,
            title: residence.title
        })
    });

    it('should find residences', async () => {
        await createResidence();

        const results = await repository.findResidences(TEST_UNIVERSITY_ID);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});