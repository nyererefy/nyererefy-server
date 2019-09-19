import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {SchoolRepository} from "../../repositories/school/schoolRepository";
import {School, SchoolInput} from "../../entities/school";

const schoolRepository = getCustomRepository(SchoolRepository);

@Resolver(() => School)
export class SchoolResolver {
    @Mutation(() => School)
    async createSchool(@Arg('input') input: SchoolInput): Promise<School> {
        return await schoolRepository.createSchool(input);
    }

    @Mutation(() => School)
    async updateSchool(
        @Arg('id', () => ID) id: number,
        @Arg('input') input: SchoolInput): Promise<School> {
        return await schoolRepository.editSchool(id, input);
    }

    @Query(() => School)
    async school(@Arg('id', () => ID) id: number): Promise<School> {
        return await schoolRepository.findSchool(id);
    }

    @Query(() => [School])
    async schools(): Promise<School[]> {
        return await schoolRepository.findSchools(1); //todo
    }
}