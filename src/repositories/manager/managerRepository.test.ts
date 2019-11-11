import '../../utils/test/initTestDb'
import {ManagerRepository} from "./managerRepository";
import {getCustomRepository} from "typeorm";
import {ManagerSignUpInput} from "../../entities/manager";
import faker from "faker";
import {RegistrationCodeRepository} from "../registrationCode/registrationCodeRepository";
import {PassportDataInterface} from "../user/userRepository";


let managerRepository: ManagerRepository;
let registrationCodeRepository: RegistrationCodeRepository;
let managerSignUpInput: ManagerSignUpInput;

beforeAll(() => {
    registrationCodeRepository = getCustomRepository(RegistrationCodeRepository);
    managerRepository = getCustomRepository(ManagerRepository);
});

beforeEach(async () => {
    const registrationCode = await registrationCodeRepository.generateRegistrationCode();

    managerSignUpInput = {
        name: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        code: registrationCode.code
    }
});


describe('Manager', () => {
    it('should create a new manager', async () => {
        const result = await managerRepository.createManager(managerSignUpInput);

        expect(result).toMatchObject({
            email: managerSignUpInput.email
        })
    });

    it('should fail to create a new manager because of wrong code', async () => {
        try {
            await managerRepository.createManager({
                ...managerSignUpInput, code: "enueeuheueheueheuheue"
            });
            expect(true).toBeFalsy()
        } catch (e) {
            expect(e.message).toBeDefined()
        }
    });

    it('should sign up and login manager', async () => {
        const input: PassportDataInterface = {
            profile: {
                emails: [{value: managerSignUpInput.email}],
                _json: {
                    email: managerSignUpInput.email,
                }
            },
            refreshToken: '',
            accessToken: 'test-test-test-test'
        };

        const signUpResult = await managerRepository.signUpWithGoogle(input, managerSignUpInput.code);
        expect(signUpResult).toMatchObject({
            email: managerSignUpInput.email
        });

        const loginResult = await managerRepository.loginWithGoogle(input);
        expect(loginResult).toMatchObject({
            email: managerSignUpInput.email
        });
    });
});