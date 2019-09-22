import {Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ClassRepository} from "../../repositories/class/classRepository";
import {Class} from "../../entities/class";

const categoryRepository = getCustomRepository(ClassRepository);

@Resolver(() => Class)
export class ClassResolver {
    @Mutation(() => [Class])
    async generateClasses(): Promise<Class[]> {
        return await categoryRepository.generateClasses(1); //todo
    }

    @Query(() => [Class])
    async classes(): Promise<Class[]> {
        return await categoryRepository.findUniversityClasses(1); //todo
    }
}