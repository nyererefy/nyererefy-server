import '../../utils/test/initTestDb'
import {ReviewRepository} from "./reviewRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {ReviewInput} from "../../entities/review";
import {TEST_SUBCATEGORY_ID, TEST_VOTER_ID} from "../../utils/consts";
import {OrderBy} from "../../utils/enums";

let repository: ReviewRepository;
let input: ReviewInput;

beforeEach(async () => {
    repository = getCustomRepository(ReviewRepository);

    input = {
        content: faker.lorem.sentence(),
        subcategoryId: TEST_SUBCATEGORY_ID
    };
});

describe('Review', () => {
    it('should create a new review', async () => {
        const result = await repository.createReview(TEST_VOTER_ID, input);

        expect(result.content).toMatch(input.content)
    });

    it('should fail to create a new review', async () => {
        try {
            await repository.createReview(TEST_VOTER_ID, {...input, subcategoryId: 100});
            expect(true).toBeFalsy()
        } catch (e) {
            expect(e.message).toBeDefined()
        }
    });

    it('should find reviews', async () => {
        await repository.createReview(TEST_VOTER_ID, input);

        const results = await repository.findReviews({
            subcategoryId: TEST_SUBCATEGORY_ID,
            offset: 0,
            limit: 10,
            orderBy: OrderBy.ASC
        });

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        )
    });

    it('should delete review', async () => {
        const review = await repository.createReview(TEST_VOTER_ID, input);

        const result = await repository.deleteReview(review.id, TEST_VOTER_ID);

        expect(result.content).toMatch(review.content)
    });
});