import {EntityRepository, Repository} from "typeorm";
import {RegistrationInput, User} from "../../entities/user";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    registerUser(input: RegistrationInput) {
        const user = this.create(input);
        return this.save(user);
    }

    editUser(input: RegistrationInput) {
        const user = this.create(input);
        return this.save(user);
    }

    findUser(id: number) {
        return this.findOne(id);
    }

    findUsers() {
        return this.find();
    }
}