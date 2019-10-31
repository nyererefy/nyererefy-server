import '../../utils/test/initTestDb'
import {ResidenceRepository} from "./residenceRepository";
import {getCustomRepository} from "typeorm";
import {TEST_UNIVERSITY_ID} from "../../utils/consts";
import {createResidence} from "../../utils/test/initDummyData";

let repository: ResidenceRepository;

beforeEach(async () => {
    repository = getCustomRepository(ResidenceRepository);
});

describe('Residence', () => {
    it('should create a new residence', async () => {
        const title = "Bugarika";
        const residence = await createResidence(title);
        expect(residence.title).toMatch(title)
    });

    it('should edit an residence', async () => {
        const title = "Bugarika edited";
        const residence = await createResidence();
        const result = await repository.editResidence(residence.id, TEST_UNIVERSITY_ID, {title});

        await expect(result).toMatchObject({
            id: residence.id,
            title: title
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