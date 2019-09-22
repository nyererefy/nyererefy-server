import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {RegistrationByProgramInput, RegistrationInput, User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @Mutation(() => User)
    async registerUser(
        @Arg('input') input: RegistrationInput,
        @Arg('intelligently', {
            defaultValue: false,
            description: 'If Registration number have common patterns all information will be extracted from it.' +
                'see more at ' //todo add link here for detailed info.
        }) intelligently: boolean
    ): Promise<User> {
        return await userRepository.registerUser(input, intelligently);
    }

    @Mutation(() => User)
    async registerUserByProgram(@Arg('input') input: RegistrationByProgramInput): Promise<User> {
        return await userRepository.registrationByProgram(input);
    }

    @Query(() => User)
    async user(@Arg('id', () => ID) id: number): Promise<User> {
        return await userRepository.findUser(id);
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await userRepository.findUsers();
    }
}