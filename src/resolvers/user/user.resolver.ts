import {Query, Resolver} from "type-graphql";
import {User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @Query(() => User)
    async user(): Promise<User> {
        return await userRepository.findUser(1) as User;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await userRepository.findUsers();
    }
}