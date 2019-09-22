import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {Subcategory} from "../../entities/subcategory";
import {SubcategoryRepository} from "../../repositories/subcategory/subcategoryRepository";

const categoryRepository = getCustomRepository(SubcategoryRepository);

@Resolver(() => Subcategory)
export class SubcategoryResolver {
    @Mutation(() => [Subcategory])
    async generateSubcategories(@Arg('electionId', () => ID) electionId: number): Promise<Subcategory[]> {
        return await categoryRepository.generateSubcategories(1, electionId); //todo
    }

    @Query(() => [Subcategory])
    async subcategories(@Arg('electionId', () => ID) electionId: number): Promise<Subcategory[]> {
        return await categoryRepository.findEligibleElectionSubcategories(electionId, 1); //todo
    }
}