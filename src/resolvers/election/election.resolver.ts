import {Arg, ID, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../../repositories/election/electionRepository";
import {Election} from "../../entities/election";

const electionRepository = getCustomRepository(ElectionRepository);

@Resolver(() => Election)
export class ElectionResolver {
    @Query(() => Election)
    async election(@Arg('id', () => ID) id: number): Promise<Election> {
        return await electionRepository.findElection(id);
    }

    @Query(() => [Election])
    async elections(): Promise<Election[]> {
        return await electionRepository.findElections(); //todo use filters.
    }
}