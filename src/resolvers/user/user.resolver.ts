import {Arg, ID, Query, Resolver} from "type-graphql";
import {User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @Query(() => User)
    async user(@Arg('id', () => ID) id: number): Promise<User> {
        return await userRepository.findUser(id);
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await userRepository.findUsers();
    }
}