import '../../utils/test/initTestDb'
import {UserRepository} from "./userRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {GetUsersArgs, RegistrationByProgramInput, User} from "../../entities/user";
import {TEST_BRANCH_ID, TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID, TEST_VOTER_ID} from "../../utils/consts";
import {Duration, OrderBy, Year} from "../../utils/enums";
import {
    createProgram,
    createSchool,
    createUser,
    generateClasses,
    registerProgram
} from "../../utils/test/initDummyData";
import {formatRegNo} from "../../helpers/regNo";

let repository: UserRepository;

beforeEach(async () => {
    repository = getCustomRepository(UserRepository);
});

describe('User', () => {
    it('should create a new user basing on program', async () => {
        const program = await createProgram(Duration.THREE_YEARS, 'DPS', 'Diploma of Pharmaceutical Sciences');
        const school = await createSchool(TEST_BRANCH_ID, 'School of Pharmaceutics', 'SOP');

        const sp = await registerProgram(school.id, program.id, 'ss');
        await generateClasses(TEST_UNIVERSITY_ID);

        const input: RegistrationByProgramInput = {
            email: faker.internet.email(),
            regNo: faker.internet.userName(),
            programIdentifier: sp.identifier,
            year: Year.THIRD_YEAR
        };

        const user = await repository.registrationByProgram(TEST_UNIVERSITY_ID, input);

        expect(user).toMatchObject({
            email: input.email.toLowerCase(),
            regNo: formatRegNo(input.regNo.toUpperCase())
        });

        //Checking if info used to register matches saved ones.
        const userInfo = await repository.findUserInfo(user.id);

        expect(userInfo).toMatchObject({
            id: user.id,
            class: {
                school: {id: school.id},
                program: {id: program.id},
            }
        });

        //finding user by email
        const userByEmail = await repository.findStudentByEmail(input.email);

        expect(userByEmail).toMatchObject({
            id: user.id,
            class: {
                school: {
                    branch: {
                        university: {
                            id: TEST_UNIVERSITY_ID
                        }
                    }
                }
            }
        });
    });

    it('should find user', async () => {
        const result = await repository.findUser(TEST_VOTER_ID);
        expect(result).toBeDefined();
    });

    it('should find user with voting info', async () => {
        const user: User = await repository.findUser(TEST_VOTER_ID);
        const userInfo: User = await repository.findUserInfo(TEST_VOTER_ID);

        //Returned class should match
        expect(userInfo.class.id).toEqual(user.class.id);
    });

    it('should find users', async () => {
        const args: GetUsersArgs = {
            offset: 0, limit: 10, query: '', orderBy: OrderBy.DESC
        };
        const results = await repository.findUsers(args);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String)
            })
        )
    });

    it('should search user', async () => {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);

        const args: GetUsersArgs = {
            offset: 0, limit: 10, query: user.regNo, orderBy: OrderBy.DESC
        };
        const results = await repository.findUsers(args);

        expect(results.length).toEqual(1);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String)
            })
        )
    });
});