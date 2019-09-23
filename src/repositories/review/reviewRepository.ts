import {EntityRepository, Repository} from "typeorm";
import {GetReviewsArgs, Review, ReviewInput} from "../../entities/review";
import {Subcategory} from "../../entities/subcategory";
import {User} from "../../entities/user";
import {OrderBy} from "../../utils/enums";


@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
    createReview(userId: number, input: ReviewInput) {
        const review = this.create(input);

        //todo catch error thrown when parent id is not available.
        const subcategory = new Subcategory();
        subcategory.id = input.subcategoryId;

        const user = new User();
        user.id = userId;

        review.subcategory = subcategory;
        review.user = user;

        return this.save(review);
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