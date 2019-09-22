import '../../utils/test/initTestDb'
import {CategoryRepository} from "./categoryRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {CategoryEditInput} from "../../entities/category";
import {Eligible} from "../../utils/enums";
import {createCategory} from "../../utils/test/initDummyData";
import {TEST_ELECTION_ID} from "../../utils/consts";

let repository: CategoryRepository;
const categoryId = 1;
const electionId = 1;

beforeEach(async () => {
    repository = getCustomRepository(CategoryRepository);
});

describe('Category', () => {
    it('should create a new category', async () => {
        const result = await createCategory(TEST_ELECTION_ID);

        expect(result).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String)
        });
    });

    it('should delete a category ', async () => {
        const createdCategory = await createCategory(TEST_ELECTION_ID);
        expect(createdCategory).toMatchObject({
            id: expect.any(Number)
        });

        const deletedCategory = await repository.deleteCategory(createdCategory.id);
        expect(deletedCategory).toMatchObject({
            id: createdCategory.id
        });
    });

    it('should edit an category', async () => {
        const input: CategoryEditInput = {
            title: faker.random.words(2),
            eligible: Eligible.BRANCH,
            categoryId
        };
        const result = await repository.updateCategory(input);

        await expect(result).toMatchObject(input)
    });

    it('should find category', async () => {
        const result = await repository.findCategory(categoryId);
        expect(result).toBeDefined();
    });

    it('should find election\'s categories', async () => {
        const results = await repository.findCategories(electionId);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});