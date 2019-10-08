import {Arg, Args, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {GetUsersArgs, LoginInput, User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";
import {Role} from "../../utils/enums";
import {TheContext} from "../../utils/TheContext";
import {authenticateWithGoogle} from "../../helpers/auth";
import {COOKIE_NAME} from "../../utils/consts";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
    @FieldResolver(() => User)
    async resolveUser(@Root() user: User): Promise<User> {
        return await userRepository.findUser(user.id);
    }

    @Mutation(() => User)
    async login(
        @Arg('input') input: LoginInput,
        @Ctx() {req, res}: TheContext
    ): Promise<User> {
        req.body = {
            ...req.body,
            access_token: input.token,
        };

        return new Promise((async (resolve, reject) => {
            // @ts-ignore
            const {data, info} = await authenticateWithGoogle(req, res);

            if (data) {
                try {
                    if (input.role === Role.STUDENT) {
                        const user = await userRepository.loginWithGoogle(data);
                        if (user) {
                            // Setting session.
                            req.session.studentId = user.id;

                            //resolving user.
                            resolve(user);
                        }
                    }

                    if (input.role === Role.MANAGER) {
                        //todo
                    }
                } catch (e) {
                    reject(e.message);
                }
            }

            if (info) {
                if (info.code === 'ETIMEDOUT') {
                    reject('Failed to reach Google: Try Again');
                } else {
                    reject('something went wrong, Try Again');
                }
            }

            reject(Error('server error, Try Again'));
        }));
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() {req, res}: TheContext): Promise<Boolean> {
        return new Promise((resolve, reject) =>
            req.session.destroy((err: any) => {
                if (err) {
                    return reject(false);
                }
                res.clearCookie(COOKIE_NAME);
                return resolve(true);
            })
        );
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