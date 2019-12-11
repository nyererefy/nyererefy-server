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
            device: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        const result = await repository.createFirebaseToken(1, token);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });
    });

    it('should update a previous firebaseToken', async () => {
        const token: FirebaseTokenInput = {
            device: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(2, token);

        const newToken: FirebaseTokenInput = {
            device: token.device,
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(2, newToken);
        const result = await repository.findUserFirebaseTokens(2);

        expect(result.length).toBe(1)
    });

    it('should add new device firebaseToken', async () => {
        const token: FirebaseTokenInput = {
            device: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, token);

        const newToken: FirebaseTokenInput = {
            device: faker.internet.userName(),
            token: faker.lorem.paragraphs(1)
        };

        await repository.createFirebaseToken(3, newToken);
        const result = await repository.findUserFirebaseTokens(3);

        expect(result.length).toBe(2)
    });
});