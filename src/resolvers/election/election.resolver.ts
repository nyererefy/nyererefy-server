import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../../repositories/election/electionRepository";
import {Election, ElectionInput} from "../../entities/election";
import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";

const electionRepository = getCustomRepository(ElectionRepository);

@Resolver(() => Election)
export class ElectionResolver {
    @Query(() => Election)
    async election(@Arg('id', () => Int) id: number): Promise<Election> {
        return await electionRepository.findElection(id);
    }

    @Query(() => [Election])
    async elections(): Promise<Election[]> {
        return await electionRepository.findElections(); //todo use filters.
    }

    @Mutation(() => Election)
    async deleteElection(@Arg('id', () => Int) id: number): Promise<Election> {
        return await electionRepository.deleteElection(id);
    }

    @Mutation(() => Election)
    async createElection(@Arg('input') input: ElectionInput): Promise<Election> {
        return await electionRepository.createElection(1, input); //todo
    }
}