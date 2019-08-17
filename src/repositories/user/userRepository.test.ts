import '../../utils/test/initTestDb'
import {UserRepository} from "./userRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {RegistrationInput} from "../../entities/user";

let repository: UserRepository;

beforeEach(async () => {
    repository = getCustomRepository(UserRepository);
});

describe('User', () => {
    it('should create a new user', async () => {
        const input: RegistrationInput = {
            email: faker.internet.email(),
            regNo: faker.company.companyName(),
            classId: 1,
            year: 1
        };
        const result = await repository.registerUser(input);

        expect(result).toMatchObject({
            email: input.email,
            regNo: input.regNo
        })
    });

    it('should find user', async () => {
        const id = 1;
        const result = await repository.findUser(id);
        expect(result).toBeDefined();
    });

    it('should find users', async () => {
        const results = await repository.findUsers();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});