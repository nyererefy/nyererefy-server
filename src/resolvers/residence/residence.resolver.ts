import {Arg, Authorized, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {ResidenceRepository} from "../../repositories/residence/residenceRepository";
import {Residence, ResidenceInput} from "../../entities/residence";
import {Role} from "../../utils/enums";
import {CurrentUniversity} from "../../utils/currentAccount";

const residenceRepository = getCustomRepository(ResidenceRepository);

@Resolver(() => Residence)
export class ResidenceResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => Residence)
    async createResidence(
        @Arg('input') input: ResidenceInput,
        @CurrentUniversity() universityId: number
    ): Promise<Residence> {
        return await residenceRepository.createResidence(universityId, input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Residence)
    async updateResidence(
        @Arg('id', () => Int) id: number,
        @Arg('input') input: ResidenceInput,
        @CurrentUniversity() universityId: number
    ): Promise<Residence> {
        return await residenceRepository.editResidence(id, universityId, input);
    }

    @Authorized(Role.MANAGER)
    @Mutation(() => Residence)
    async deleteResidence(
        @Arg('id', () => Int) id: number,
        @CurrentUniversity() universityId: number
    ): Promise<Residence> {
        return await residenceRepository.deleteResidence(id, universityId);
    }

    @Query(() => Residence)
    async residence(@Arg('id', () => Int) id: number): Promise<Residence> {
        return await residenceRepository.findResidence(id);
    }

    @Authorized()
    @Query(() => [Residence])
    async residences(@CurrentUniversity() universityId: number): Promise<Residence[]> {
        return await residenceRepository.findResidences(universityId);
    }
}