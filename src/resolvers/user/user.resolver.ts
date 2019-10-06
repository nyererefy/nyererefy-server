import {Arg, Args, FieldResolver, Int, Query, Resolver, Root} from "type-graphql";
import {GetUsersArgs, User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @FieldResolver(() => User)
    async resolveUser(@Root() user: User): Promise<User> {
        return await userRepository.findUser(user.id);
    }

    @Query(() => User)
    async user(@Arg('id', () => Int) id: number): Promise<User> {
        return await userRepository.findUser(id);
    }

    @Query(() => [User])
    async users(@Args() args: GetUsersArgs): Promise<User[]> {
        return await userRepository.findUsers(args);
    }
}