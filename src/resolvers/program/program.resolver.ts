import {Arg, Args, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ProgramRepository} from "../../repositories/program/programRepository";
import {GetProgramsArgs, Program, ProgramInput} from "../../entities/program";
import {SchoolProgramRepository} from "../../repositories/schoolProgram/schoolProgramRepository";
import {SchoolProgram, SchoolProgramInput} from "../../entities/schoolProgram";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const programRepository = getCustomRepository(ProgramRepository);
const schoolProgramRepository = getCustomRepository(SchoolProgramRepository);

@Resolver(() => Program)
export class ProgramResolver {
    @Authorized(Role.ADMIN)
    @Mutation(() => Program)
    async createProgram(@Arg('input') input: ProgramInput): Promise<Program> {
        return await programRepository.createProgram(input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => SchoolProgram)
    async registerProgram(@Arg('input') input: SchoolProgramInput): Promise<SchoolProgram> {
        return await schoolProgramRepository.registerProgram(input);
    }

    @Authorized(Role.ADMIN)
    @Mutation(() => Program)
    async updateProgram(
        @Arg('id', () => Int) id: number, //todo merge these into one.
        @Arg('input') input: ProgramInput
    ): Promise<Program> {
        return await programRepository.editProgram(id, input);
    }

    @Query(() => Program)
    async program(@Arg('id', () => Int) id: number): Promise<Program> {
        return await programRepository.findProgram(id);
    }

    @Query(() => [Program])
    async programs(
        @Args() args: GetProgramsArgs,
        @CurrentUniversity() universityId: number
    ): Promise<Program[]> {
        //Returning all university's programs
        if (args.filter) {
            return await programRepository.findUniversityPrograms(universityId);
        }

        //Returning all
        return await programRepository.findPrograms();
    }

    @Authorized(Role.ADMIN)
    @Mutation(() => SchoolProgram)
    async deleteSchoolProgram(
        @Arg('id', () => Int) id: number,
        @CurrentUniversity() universityId: number
    ): Promise<SchoolProgram> {
        return await schoolProgramRepository.deleteSchoolProgram(id, universityId);
    }
}