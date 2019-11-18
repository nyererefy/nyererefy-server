import {EntityRepository, Repository} from "typeorm";
import {GetReviewsArgs, Review, ReviewInput} from "../../entities/review";
import {Subcategory} from "../../entities/subcategory";
import {User} from "../../entities/user";
import {OrderBy} from "../../utils/enums";
import {CACHE_MID_TIME, CACHE_REVIEW_ID} from "../../utils/consts";


@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
    async createReview(userId: number, input: ReviewInput) {
        let review = this.create(input);

        const subcategory = new Subcategory();
        subcategory.id = input.subcategoryId;

        const user = new User();
        user.id = userId;

        review.subcategory = subcategory;
        review.user = user;

        try {
            return await this.save(review);
        } catch (e) {
            throw new Error('Subcategory does not exist!')
        }
    }

    async deleteReview(reviewId: number, userId: number): Promise<Review> {
        const user = new User();
        user.id = userId;

        const review = await this.findOne({where: {id: reviewId, user}});

        if (!review) throw new Error('Review was not found');

        await this.createQueryBuilder()
            .delete()
            .where("id = :reviewId", {reviewId})
            .execute();

        return review;
    }

    /**
     * We are caching result so as it wont slow us down in subscription.
     * @param reviewId
     */
    async findReview(reviewId: number): Promise<Review> {
        const review = await this.findOne(reviewId, {
            cache: {
                id: `${CACHE_REVIEW_ID}:${reviewId}`,
                milliseconds: CACHE_MID_TIME,
            }
        });

        if (!review) throw new Error('Review was not found');

        return review;
    }

    async findReviews({subcategoryId, offset = 0, limit = 10, orderBy = OrderBy.DESC}: GetReviewsArgs): Promise<Review[]> {
        return this.createQueryBuilder('review')
            .innerJoinAndSelect('review.user', 'user')
            .where('review.subcategory = :subcategoryId', {subcategoryId})
            .limit(limit)
            .offset(offset)
            .orderBy('review.id', orderBy)
            .getMany();
    }
}