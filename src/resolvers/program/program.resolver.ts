import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ProgramRepository} from "../../repositories/program/programRepository";
import {Program, ProgramInput} from "../../entities/program";
import {SchoolProgramRepository} from "../../repositories/schoolProgram/schoolProgramRepository";

const programRepository = getCustomRepository(ProgramRepository);
const schoolProgramRepository = getCustomRepository(SchoolProgramRepository);

@Resolver(() => Program)
export class ProgramResolver {
    @Mutation(() => Program)
    async createProgram(@Arg('input') input: ProgramInput): Promise<Program> {
        return await programRepository.createProgram(input);
    }

    @Mutation(() => Boolean)
    async registerProgram(
        @Arg('schoolId', () => ID) schoolId: number,
        @Arg('programId', () => ID) programId: number
    ): Promise<Boolean> {
        return await !!schoolProgramRepository.registerProgram({schoolId, programId});
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