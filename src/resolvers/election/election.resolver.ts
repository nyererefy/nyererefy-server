import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../../repositories/election/electionRepository";
import {Election, ElectionInput, GetElectionsArgs} from "../../entities/election";
import {Arg, Args, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const electionRepository = getCustomRepository(ElectionRepository);

@Resolver(() => Election)
export class ElectionResolver {
    @Query(() => Election)
    async election(@Arg('id', () => Int) id: number): Promise<Election> {
        return await electionRepository.findElection(id);
    }

    @Query(() => [Election])
    async elections(
        @CurrentUniversity() universityId: number,
        @Args() args: GetElectionsArgs,
        @Arg(
            'strict',
            {
                description: 'If true, Only specific university\'s elections will be fetched or return empty array otherwise',
                defaultValue: false
            },
        )strict: boolean
    ): Promise<Election[]> {
        if (universityId || strict) {
            return await electionRepository.findUniversityElections(universityId, args);
        }
        return await electionRepository.findElections(args);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Election)
    async deleteElection(@Arg('id', () => Int) id: number): Promise<Election> {
        return await electionRepository.deleteElection(id);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Election)
    async createElection(
        @Arg('input') input: ElectionInput,
        @CurrentUniversity() universityId: number
    ): Promise<Election> {
        return await electionRepository.createElection(universityId, input);
    }
}