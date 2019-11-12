import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Manager, ManagerSocialSignUpInput} from "../../entities/manager";
import {getCustomRepository} from "typeorm";
import {ManagerRepository} from "../../repositories/manager/managerRepository";
import {TheContext} from "../../utils/TheContext";
import {authenticateWithGoogle} from "../../helpers/auth";
import {CurrentManager} from "../../utils/currentAccount";
import {Role} from "../../utils/enums";

const managerRepository = getCustomRepository(ManagerRepository);

@Resolver(() => Manager)
export class ManagerResolver {
    @Mutation(() => Manager)
    async registerManager(
        @Arg('input') input: ManagerSocialSignUpInput,
        @Ctx() {req, res}: TheContext
    ): Promise<Manager> {
        req.body = {
            ...req.body,
            access_token: input.token,
        };
        return new Promise((async (resolve, reject) => {
            // @ts-ignore
            const {data, info} = await authenticateWithGoogle(req, res);

            if (data) {
                try {
                    const manager = await managerRepository.signUpWithGoogle(data, input.code);
                    if (manager) {
                        // Setting session.
                        req.session.managerId = manager.id;

                        //resolving manager.
                        resolve(manager);
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

    @Authorized(Role.MANAGER)
    @Query(() => Manager)
    async currentManager(
        @CurrentManager() managerId: number
    ): Promise<Manager> {
        return managerRepository.findManager(managerId)
    }
}