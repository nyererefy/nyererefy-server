import '../../utils/test/initTestDb'
import {SchoolRepository} from "./schoolRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {SchoolInput} from "../../entities/school";

let repository: SchoolRepository;

beforeAll(async () => {
    repository = getCustomRepository(SchoolRepository);
});

describe('School', () => {
    it('should create a new schools basing on university\'s id', async () => {
        const input: SchoolInput = {
            title: faker.random.words(3),
            identifier: faker.internet.userName(),
        };
        const result = await repository.createSchool(1, input);

        expect(result).toMatchObject({
            title: input.title
        })
    });

    // it('should find user', async () => {
    //     const id = 1;
    //     const result = await repository.findUser(id);
    //     expect(result).toBeDefined();
    // });
    //
    // it('should find users', async () => {
    //     const results = await repository.findUsers();
    //
    //     expect(results).toContainEqual(
    //         expect.objectContaining({
    //             id: expect.any(Number),
    //             email: expect.any(String)
    //         })
    //     )
    // });
});