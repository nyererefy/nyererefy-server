import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {Subcategory} from "../../entities/subcategory";
import {SubcategoryRepository} from "../../repositories/subcategory/subcategoryRepository";

const categoryRepository = getCustomRepository(SubcategoryRepository);

@Resolver(() => Subcategory)
export class SubcategoryResolver {
    @Mutation(() => [Subcategory])
    async generateSubcategories(@Arg('electionId', () => Int) electionId: number): Promise<Subcategory[]> {
        return await categoryRepository.generateSubcategories(1, electionId); //todo
    }

    @Query(() => [Subcategory])
    async subcategories(@Arg('electionId', () => Int) electionId: number): Promise<Subcategory[]> {
        //If user is logged in we just return Subcategories he deserves.
        //todo do the same to elections. Show all if user has not login and filters otherwise.
        if (1 === 1) {
            return await categoryRepository.findEligibleElectionSubcategories(electionId, 1);
        }
        return await categoryRepository.findElectionSubcategories(electionId);
    }
}