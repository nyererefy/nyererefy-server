import '../../utils/test/initTestDb'
import {CategoryRepository} from "./categoryRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {CategoryEditInput, CategoryInput} from "../../entities/category";
import {Eligible} from "../../utils/enums";

let repository: CategoryRepository;
const categoryId = 1;
const electionId = 1;

beforeEach(async () => {
    repository = getCustomRepository(CategoryRepository);
});

describe('Category', () => {
    it('should create a new category', async () => {
        const input: CategoryInput = {
            title: faker.random.words(2),
            electionId: 1,
            eligible: Eligible.ALL
        };
        const result = await repository.createCategory(input);

        expect(result.title).toMatch(input.title)
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