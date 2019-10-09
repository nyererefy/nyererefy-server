import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {UniversityRepository} from "../../repositories/university/universityRepository";
import {University, UniversityInput} from "../../entities/university";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const universityRepository = getCustomRepository(UniversityRepository);

@Resolver(() => University)
export class UniversityResolver {
    //todo should generate keys which will be sent to their email first.
    @Authorized(Role.MANAGER)
    @Mutation(() => University)
    async createUniversity(@Arg('input') input: UniversityInput): Promise<University> {
        return await universityRepository.createUniversity(input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => String)
    async regenerateSecret(
        @CurrentUniversity() universityId: number
    ): Promise<string> {
        return await universityRepository.regenerateSecret(universityId);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => University)
    async updateUniversity(
        @Arg('input') input: UniversityInput,
        @CurrentUniversity() universityId: number
    ): Promise<University> {
        return await universityRepository.editUniversity(universityId, input);
    }

    @Query(() => University)
    async university(@Arg('id', () => Int) id: number): Promise<University> {
        return await universityRepository.findUniversity(id);
    }

    @Query(() => [University])
    async universities(): Promise<University[]> {
        return await universityRepository.findUniversities();
    }
}