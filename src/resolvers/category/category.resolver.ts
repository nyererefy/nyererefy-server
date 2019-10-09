import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CategoryRepository} from "../../repositories/category/categoryRepository";
import {Category, CategoryEditInput, CategoryInput} from "../../entities/category";
import {Role} from "../../utils/enums";

const categoryRepository = getCustomRepository(CategoryRepository);

@Resolver(() => Category)
export class CategoryResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => Category)
    async createCategory(@Arg('input') input: CategoryInput): Promise<Category> {
        return await categoryRepository.createCategory(input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Category)
    async updateCategory(@Arg('input') input: CategoryEditInput): Promise<Category> {
        return await categoryRepository.updateCategory(input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Category)
    async deleteCategory(@Arg('id', () => Int) id: number): Promise<Category> {
        return await categoryRepository.deleteCategory(id);
    }

    @Authorized(Role.MANAGER)
    @Query(() => Category)
    async category(@Arg('id', () => Int) id: number): Promise<Category> {
        return await categoryRepository.findCategory(id);
    }

    @Authorized(Role.MANAGER)
    @Query(() => [Category])
    async categories(@Arg('electionId', () => Int) electionId: number): Promise<Category[]> {
        return await categoryRepository.findCategories(electionId);
    }
}