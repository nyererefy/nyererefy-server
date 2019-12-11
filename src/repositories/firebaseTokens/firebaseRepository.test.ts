import '../../utils/test/initTestDb'
import {FirebaseRepository} from "./firebaseRepository";
import {getCustomRepository} from "typeorm";
import {FirebaseTokenInput} from "../../entities/firebaseToken";
import faker from 'faker'

let repository: FirebaseRepository;

beforeAll(async () => {
    repository = getCustomRepository(FirebaseRepository);
});

describe('FirebaseToken', () => {
    it('should create a new firebaseToken', async () => {
        const token: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        const result = await repository.createFirebaseToken(1, token);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });
    });

    it('should update a previous firebaseToken', async () => {
        const token: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(2, token);

        const newToken: FirebaseTokenInput = {
            deviceId: token.deviceId,
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(2, newToken);
        const result = await repository.findUserFirebaseTokens(2);

        expect(result.length).toBe(1)
    });

    it('should add new deviceId firebaseToken', async () => {
        const token: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, token);

        const newToken: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, newToken);
        const result = await repository.findUserFirebaseTokens(3);

        expect(result.length).toBe(2)
    });

    it('should find user\'s firebase tokens', async () => {
        const newToken: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, newToken);
        const result = await repository.findUserFirebaseTokens(3);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].user.regNo).toBeDefined();
    });

    it('should find all users\' firebase tokens', async () => {
        const newToken: FirebaseTokenInput = {
            deviceId: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, newToken);
        const result = await repository.findAllUsersFirebaseTokens();

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].user.regNo).toBeDefined();
    });
});