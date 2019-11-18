import '../../utils/test/initTestDb'
import {UserRepository} from "./userRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {GetUsersArgs, RegistrationByProgramInput, User, UserSetupInput} from "../../entities/user";
import {TEST_BRANCH_ID, TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID, TEST_VOTER_ID} from "../../utils/consts";
import {Duration, OrderBy, Sex, Year} from "../../utils/enums";
import {
    createElection,
    createProgram,
    createResidence,
    createSchool,
    createUser,
    generateClasses,
    registerProgram
} from "../../utils/test/initDummyData";
import {formatRegNo} from "../../helpers/regNo";
import {ElectionRepository} from "../election/electionRepository";

let repository: UserRepository;
let electionRepository: ElectionRepository;

beforeEach(async () => {
    repository = getCustomRepository(UserRepository);
    electionRepository = getCustomRepository(ElectionRepository);
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

    it('should setup user', async () => {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);

        const input: UserSetupInput = {
            name: "Natalia Kateile",
            username: "Naa",
            password: "password",
            sex: Sex.FEMALE
        };

        const confirmDataResult = await repository.confirmData(user.id);
        expect(confirmDataResult).toMatchObject({
            isDataConfirmed: true
        });

        const result = await repository.setupUser(user.id, input);
        expect(result).toMatchObject({
            id: user.id
        });
    });

    it('should verify password', async () => {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);

        const input: UserSetupInput = {
            name: "Nia Kateile",
            username: "nia",
            password: "nia@46567",
            sex: Sex.FEMALE
        };
        await repository.confirmData(user.id);
        await repository.setupUser(user.id, input);

        const result = await repository.verifyPassword(user.id, input.password);
        expect(result).toBeTruthy();
    });

    it('should fail verify wrong password', async () => {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);

        const input: UserSetupInput = {
            name: "Kheri Kateile",
            username: "kheri",
            password: "nia@46567",
            sex: Sex.MALE
        };

        await repository.confirmData(user.id);
        await repository.setupUser(user.id, input);

        try {
            await repository.verifyPassword(user.id, 'wrong_pass');
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e.message).toMatch(/wrong/);
        }
    });

    it('should fail verify null password', async () => {
        const user = await createUser(TEST_PROGRAM_IDENTIFIER);

        try {
            await repository.verifyPassword(user.id, 'anything');
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e.message).toMatch(/password/);
        }
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

    it('should update user\'s residence', async () => {
        const residence = await createResidence();
        const result = await repository.updateResidence(TEST_VOTER_ID, residence.id, TEST_UNIVERSITY_ID);
        expect(result.residence!.id).toEqual(residence.id);
    });

    it('should fail to update user\'s residence', async () => {
        const election = await createElection(TEST_UNIVERSITY_ID);
        await electionRepository.openElection(election.id);
        const residence = await createResidence();

        try {
            await repository.updateResidence(TEST_VOTER_ID, residence.id, TEST_UNIVERSITY_ID);
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e.message).toBeDefined()
        }
    });

});