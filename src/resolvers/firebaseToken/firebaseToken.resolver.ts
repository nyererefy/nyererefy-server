import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CurrentStudent} from "../../utils/currentAccount";
import {FirebaseTokenInput} from "../../entities/firebaseToken";
import {FirebaseRepository} from "../../repositories/firebaseTokens/firebaseRepository";

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
}