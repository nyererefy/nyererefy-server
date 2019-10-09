import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {Subcategory} from "../../entities/subcategory";
import {SubcategoryRepository} from "../../repositories/subcategory/subcategoryRepository";
import {Role} from "../../utils/enums";
import {CurrentStudent, CurrentUniversity} from "../../utils/currentAccount";

const categoryRepository = getCustomRepository(SubcategoryRepository);

@Resolver(() => Subcategory)
export class SubcategoryResolver {
    @Query(() => Subcategory)
    async subcategory(@Arg('id', () => Int) id: number): Promise<Subcategory> {
        return await categoryRepository.findSubcategory(id);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => [Subcategory])
    async generateSubcategories(
        @Arg('electionId', () => Int) electionId: number,
        @CurrentUniversity() universityId: number
    ): Promise<Subcategory[]> {
        return await categoryRepository.generateSubcategories(universityId, electionId);
    }

    @Query(() => [Subcategory])
    async subcategories(
        @Arg('electionId', () => Int) electionId: number,
        @CurrentStudent() studentId: number
    ): Promise<Subcategory[]> {
        //If user is logged in we just return Subcategories he deserves.
        if (studentId) {
            return await categoryRepository.findEligibleElectionSubcategories(electionId, studentId);
        }
        return await categoryRepository.findElectionSubcategories(electionId);
    }
}