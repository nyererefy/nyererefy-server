import '../../utils/test/initTestDb'
import {UserRepository} from "./userRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {RegistrationInput, User} from "../../entities/user";

let repository: UserRepository;
let userId = 1;

beforeEach(async () => {
    repository = getCustomRepository(UserRepository);

});

describe('User', () => {
    it('should create a new user basing on university\'s uuid', async () => {
        const input: RegistrationInput = {
            email: faker.internet.email(),
            regNo: faker.internet.userName(),
            classId: 1
        };
        const result = await repository.registerUser(input);

        expect(result).toMatchObject({
            email: input.email.toLowerCase(),
            regNo: input.regNo.toUpperCase()
        })
    });

    it('should find user', async () => {
        const result = await repository.findUser(userId);
        expect(result).toBeDefined();
    });

    it('should find user with voting info', async () => {
        const user: User = await repository.findUser(userId);
        const userInfo: User = await repository.findUserInfo(userId);

        //Returned class should match
        expect(userInfo.class.id).toEqual(user.class.id);
    });

    it('should find users', async () => {
        const results = await repository.findUsers();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String)
            })
        )
    });
});