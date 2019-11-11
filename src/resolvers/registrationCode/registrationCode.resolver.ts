import {Authorized, Mutation, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {RegistrationCodeRepository} from "../../repositories/registrationCode/registrationCodeRepository";
import {RegistrationCode} from "../../entities/registrationCode";
import {Role} from "../../utils/enums";

const registrationCodeRepository = getCustomRepository(RegistrationCodeRepository);

@Resolver(() => RegistrationCode)
export class RegistrationCodeResolver {
    @Authorized(Role.ADMIN)
    @Mutation(() => RegistrationCode)
    async generateRegistrationCode(): Promise<RegistrationCode> {
        return await registrationCodeRepository.generateRegistrationCode();
    }
}