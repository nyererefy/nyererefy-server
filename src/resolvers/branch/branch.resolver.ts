import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {BranchRepository} from "../../repositories/branch/branchRepository";
import {Branch, BranchInput} from "../../entities/branch";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const branchRepository = getCustomRepository(BranchRepository);

@Resolver(() => Branch)
export class BranchResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => Branch)
    async createBranch(
        @Arg('input') input: BranchInput,
        @CurrentUniversity() universityId: number
    ): Promise<Branch> {
        return await branchRepository.createBranch(universityId, input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Branch)
    async updateBranch(
        @Arg('id', () => Int) id: number,
        @Arg('input') input: BranchInput): Promise<Branch> {
        return await branchRepository.editBranch(id, input);
    }

    @Authorized(Role.MANAGER)
    @Query(() => Branch)
    async branch(@Arg('id', () => Int) id: number): Promise<Branch> {
        return await branchRepository.findBranch(id);
    }

    @Authorized(Role.MANAGER)
    @Query(() => [Branch])
    async branches(@CurrentUniversity() universityId: number): Promise<Branch[]> {
        return await branchRepository.findUniversityBranches(universityId);
    }
}