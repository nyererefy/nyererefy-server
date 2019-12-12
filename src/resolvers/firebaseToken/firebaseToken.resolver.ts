import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CurrentStudent} from "../../utils/currentAccount";
import {AlertInput, FirebaseTokenInput} from "../../entities/firebaseToken";
import {FirebaseRepository} from "../../repositories/firebaseTokens/firebaseRepository";
import {sendEmailToAllUsers} from "../../helpers/mail";
import {notifyAll} from "../../helpers/notification";
import {Role} from "../../utils/enums";

const repository = getCustomRepository(FirebaseRepository);

@Resolver()
export class FirebaseTokenResolver {
    @Authorized()
    @Mutation(() => Boolean)
    async createFirebaseToken(
        @Arg('input') input: FirebaseTokenInput,
        @CurrentStudent() userId: number
    ): Promise<boolean> {
        return !!await repository.createFirebaseToken(userId, input);
    }

    @Authorized(Role.ADMIN)
    @Mutation(() => Boolean)
    async createNotificationAlert(
        @Arg('input') {title, body}: AlertInput,
    ): Promise<boolean> {
        await notifyAll({title, body});
        return true;
    }

    // @Authorized(Role.ADMIN) //todo
    @Mutation(() => Boolean)
    async createEmailAlert(
        @Arg('input') input: AlertInput,
    ): Promise<boolean> {
        await sendEmailToAllUsers(input.title, input.body);
        return true;
    }
}