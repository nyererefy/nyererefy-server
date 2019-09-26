import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {UniversityRepository} from "../../repositories/university/universityRepository";
import {University, UniversityInput} from "../../entities/university";

const universityRepository = getCustomRepository(UniversityRepository);

@Resolver(() => University)
export class UniversityResolver {
    @Mutation(() => University)
    async createUniversity(@Arg('input') input: UniversityInput): Promise<University> {
        return await universityRepository.createUniversity(input);
    }

    @Mutation(() => University)
    async updateUniversity(
        @Arg('id', () => Int) id: number,
        @Arg('input') input: UniversityInput): Promise<University> {
        return await universityRepository.editUniversity(id, input);
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