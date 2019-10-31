import {Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver} from "type-graphql";
import {GetUsersArgs, LoginInput, User, UserSetupInput} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";
import {Role} from "../../utils/enums";
import {TheContext} from "../../utils/TheContext";
import {authenticateWithGoogle} from "../../helpers/auth";
import {COOKIE_NAME} from "../../utils/consts";
import {CurrentStudent} from "../../utils/currentAccount";

const userRepository = getCustomRepository(UserRepository);

@Resolver(() => User)
export class UserResolver {
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
                            req.session.classId = user.class.id;
                            req.session.universityId = user.class.school.branch.university.id;

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

    @Authorized()
    @Query(() => User)
    async me(@CurrentStudent() userId: number): Promise<User> {
        return await userRepository.findUser(userId);
    }

    @Authorized()
    @Mutation(() => User)
    async confirmData(@CurrentStudent() userId: number): Promise<User> {
        return await userRepository.confirmData(userId);
    }

    @Authorized()
    @Mutation(() => User)
    async setupAccount(
        @CurrentStudent() userId: number,
        @Arg('input') input: UserSetupInput
    ): Promise<User> {
        return await userRepository.setupUser(userId, input);
    }

    @Authorized(Role.MANAGER)
    @Query(() => [User])
    async users(@Args() args: GetUsersArgs): Promise<User[]> {
        return await userRepository.findUsers(args);
    }

    @Authorized()
    @Mutation(() => User)
    async updateResidence(
        @CurrentStudent() userId: number,
        @Arg('residenceId', () => Int) residenceId: number
    ): Promise<User> {
        return await userRepository.updateResidence(userId, residenceId);
    }
}