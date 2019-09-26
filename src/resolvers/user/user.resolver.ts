import {Arg, FieldResolver, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {RegistrationByProgramInput, User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @FieldResolver(() => User)
    async resolveUser(@Root() user: User): Promise<User> {
        return await userRepository.findUser(user.id);
    }

    @Mutation(() => User)
    async registerUserByProgram(@Arg('input') input: RegistrationByProgramInput): Promise<User> {
        return await userRepository.registrationByProgram(1, input); //Todo
    }

    @Query(() => User)
    async user(@Arg('id', () => Int) id: number): Promise<User> {
        return await userRepository.findUser(id);
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await userRepository.findUsers();
    }
}