import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ProgramRepository} from "../../repositories/program/programRepository";
import {Program, ProgramInput} from "../../entities/program";
import {SchoolProgramRepository} from "../../repositories/schoolProgram/schoolProgramRepository";
import {SchoolProgram, SchoolProgramInput} from "../../entities/schoolProgram";

const programRepository = getCustomRepository(ProgramRepository);
const schoolProgramRepository = getCustomRepository(SchoolProgramRepository);

@Resolver(() => Program)
export class ProgramResolver {
    @Mutation(() => Program)
    async createProgram(@Arg('input') input: ProgramInput): Promise<Program> {
        return await programRepository.createProgram(input);
    }

    @Mutation(() => SchoolProgram)
    async registerProgram(@Arg('input') input: SchoolProgramInput): Promise<SchoolProgram> {
        return await schoolProgramRepository.registerProgram(input);
    }

    @Mutation(() => Program)
    async updateProgram(
        @Arg('id', () => ID) id: number,
        @Arg('input') input: ProgramInput
    ): Promise<Program> {
        return await programRepository.editProgram(id, input);
    }

    @Query(() => Program)
    async program(@Arg('id', () => ID) id: number): Promise<Program> {
        return await programRepository.findProgram(id);
    }

    @Query(() => [Program])
    async programs(): Promise<Program[]> {
        return await programRepository.findPrograms();
    }
}