import {EntityRepository, Repository} from "typeorm";
import {FirebaseToken, FirebaseTokenInput} from "../../entities/firebaseToken";
import {User} from "../../entities/user";

@EntityRepository(FirebaseToken)
export class FirebaseRepository extends Repository<FirebaseToken> {
    async createFirebaseToken(userId: number, input: FirebaseTokenInput): Promise<FirebaseToken> {
        const user = new User();
        user.id = userId;

        //Checking if deviceId's token exists.
        const previousFirebaseToken = await this.findOne(
            {where: {deviceId: input.deviceId}}
        );

        if (previousFirebaseToken) {
            previousFirebaseToken.token = input.token;
            return await this.save(previousFirebaseToken)
        }

        //Else create new one.
        let newFirebaseToken = this.create(input);
        newFirebaseToken = this.merge(newFirebaseToken, {user});

        return await this.save(newFirebaseToken);
    }

    findUserFirebaseTokens(userId: number): Promise<FirebaseToken[]> {
        const user = new User();
        user.id = userId;

        return this.find({where: {user}, relations: ['user']})
    }

    findAllUsersFirebaseTokens(): Promise<FirebaseToken[]> {
        return this.find({select: ["token"]})
    }
}