import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {BranchRepository} from "../../repositories/branch/branchRepository";
import {Branch, BranchInput} from "../../entities/branch";

const branchRepository = getCustomRepository(BranchRepository);

@Resolver(() => Branch)
export class BranchResolver {
    @Mutation(() => Branch)
    async createBranch(@Arg('input') input: BranchInput): Promise<Branch> {
        return await branchRepository.createBranch(1, input); //todo
    }

    @Mutation(() => Branch)
    async updateBranch(
        @Arg('id', () => Int) id: number,
        @Arg('input') input: BranchInput): Promise<Branch> {
        return await branchRepository.editBranch(id, input);
    }

    @Query(() => Branch)
    async branch(@Arg('id', () => Int) id: number): Promise<Branch> {
        return await branchRepository.findBranch(id);
    }

    @Query(() => [Branch])
    async branches(): Promise<Branch[]> {
        return await branchRepository.findUniversityBranches(1); //todo
    }
}