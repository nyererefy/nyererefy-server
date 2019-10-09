import {Authorized, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ClassRepository} from "../../repositories/class/classRepository";
import {Class} from "../../entities/class";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const categoryRepository = getCustomRepository(ClassRepository);

@Resolver(() => Class)
export class ClassResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => [Class])
    async generateClasses(@CurrentUniversity() universityId: number): Promise<Class[]> {
        return await categoryRepository.generateClasses(universityId);
    }

    @Authorized()
    @Query(() => [Class])
    async classes(@CurrentUniversity() universityId: number): Promise<Class[]> {
        return await categoryRepository.findUniversityClasses(universityId);
    }
}