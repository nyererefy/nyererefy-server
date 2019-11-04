import '../../utils/test/initTestDb'
import {RegistrationCodeRepository} from "./registrationCodeRepository";
import {getCustomRepository} from "typeorm";

let repository: RegistrationCodeRepository;

beforeEach(async () => {
    repository = getCustomRepository(RegistrationCodeRepository);
});

describe('RegistrationCode', () => {
    it('should generate a new code', async () => {
        const result = await repository.generateRegistrationCode();
        expect(result.code.length).toEqual(32)
    });

    it('should find code', async () => {
        const registrationCode = await repository.generateRegistrationCode();
        const result = await repository.findRegistrationCode(registrationCode.code);
        expect(result.code).toMatch(registrationCode.code);
    });

    it('should delete code', async () => {
        const registrationCode = await repository.generateRegistrationCode();
        const result = await repository.deleteRegistrationCode(registrationCode.id);
        expect(result).toBeDefined();

        try {
            await repository.findRegistrationCode(registrationCode.code);
            expect(true).toBeFalsy()
        } catch (e) {
            expect(e.message).toBeDefined()
        }
    });
});