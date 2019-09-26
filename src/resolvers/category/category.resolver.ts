import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CategoryRepository} from "../../repositories/category/categoryRepository";
import {Category, CategoryEditInput, CategoryInput} from "../../entities/category";

const categoryRepository = getCustomRepository(CategoryRepository);

@Resolver(() => Category)
export class CategoryResolver {
    @Mutation(() => Category)
    async createCategory(@Arg('input') input: CategoryInput): Promise<Category> {
        return await categoryRepository.createCategory(input);
    }

    @Mutation(() => Category)
    async updateCategory(@Arg('input') input: CategoryEditInput): Promise<Category> {
        return await categoryRepository.updateCategory(input);
    }

    @Mutation(() => Category)
    async deleteCategory(@Arg('id', () => Int) id: number): Promise<Category> {
        return await categoryRepository.deleteCategory(id);
    }

    @Query(() => Category)
    async category(@Arg('id', () => Int) id: number): Promise<Category> {
        return await categoryRepository.findCategory(id);
    }

    @Query(() => [Category])
    async categories(@Arg('electionId', () => Int) electionId: number): Promise<Category[]> {
        return await categoryRepository.findCategories(electionId);
    }
}