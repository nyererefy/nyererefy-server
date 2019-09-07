import '../../utils/test/initTestDb'
import {createSchool} from "../../utils/test/initDummyData";

// let repository: SchoolRepository;

beforeAll(async () => {
    //repository = getCustomRepository(SchoolRepository);
});

describe('School', () => {
    it('should create a new schools basing on university\'s id', async () => {
        const result = await createSchool(1);

        expect(result).toMatchObject({
            title: expect.any(String),
            university: {id: 1}
        })
    });
});