import '../../utils/test/initTestDb'
import {UserRepository} from "./userRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {RegistrationInput} from "../../entities/user";
import {UniversityRepository} from "../university/universityRepository";
import {University} from "../../entities/university";

let repository: UserRepository;
let universityRepository: UniversityRepository;
let university: University;

beforeEach(async () => {
    repository = getCustomRepository(UserRepository);
    universityRepository = getCustomRepository(UniversityRepository);

    university = await universityRepository.findUniversity(1)
});

describe('User', () => {
    it('should create a new user basing on university\'s uuid', async () => {
        const input: RegistrationInput = {
            email: faker.internet.email(),
            regNo: faker.internet.userName(),
            uuid: university.uuid
        };
        const result = await repository.registerUser(input);

        expect(result).toMatchObject({
            email: input.email.toLowerCase(),
            regNo: input.regNo.toUpperCase()
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
                email: expect.any(String)
            })
        )
    });
});