import '../../utils/test/initTestDb'
import {CategoryRepository} from "./categoryRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {Category, CategoryEditInput, CategoryInput} from "../../entities/category";
import {Eligible} from "../../utils/enums";

let repository: CategoryRepository;
let categories: Category[];

beforeEach(async () => {
    repository = getCustomRepository(CategoryRepository);
    categories = await repository.findCategories();
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
        const id = categories[0].id;

        const input: CategoryEditInput = {
            title: faker.random.words(2),
            eligible: Eligible.BRANCH
        };
        const result = await repository.editCategory(id, input);

        await expect(result).toMatchObject(input)
    });

    it('should find category', async () => {
        const id = categories[0].id;
        const result = await repository.findCategory(id);
        expect(result).toBeDefined();
    });

    it('should find categories', async () => {
        const results = await repository.findCategories();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});