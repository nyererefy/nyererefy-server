import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {SchoolRepository} from "../../repositories/school/schoolRepository";
import {School, SchoolInput} from "../../entities/school";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const schoolRepository = getCustomRepository(SchoolRepository);

@Resolver(() => School)
export class SchoolResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => School)
    async createSchool(@Arg('input') input: SchoolInput): Promise<School> {
        return await schoolRepository.createSchool(input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => School)
    async updateSchool(
        @Arg('id', () => Int) id: number,
        @Arg('input') input: SchoolInput): Promise<School> {
        return await schoolRepository.editSchool(id, input);
    }

    @Query(() => School)
    async school(@Arg('id', () => Int) id: number): Promise<School> {
        return await schoolRepository.findSchool(id);
    }

    @Authorized(Role.STUDENT, Role.MANAGER)
    @Query(() => [School])
    async schools(@CurrentUniversity() universityId: number): Promise<School[]> {
        return await schoolRepository.findSchools(universityId);
    }
}