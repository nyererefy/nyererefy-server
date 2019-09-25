import {getCustomRepository} from "typeorm";
import {ReviewRepository} from "../../repositories/review/reviewRepository";
import {GetReviewsArgs, Review, ReviewInput} from "../../entities/review";
import {Arg, Args, Int, Mutation, Publisher, PubSub, Query, Resolver, Root, Subscription} from "type-graphql";
import {TEST_VOTER_ID} from "../../utils/consts";
import {Topic} from "../../utils/enums";

const reviewRepository = getCustomRepository(ReviewRepository);

@Resolver(() => Review)
export class ReviewResolver {
    @Mutation(() => Review)
    async createReview(
        @Arg('input') input: ReviewInput,
        @PubSub(Topic.REVIEWING) publish: Publisher<Review>
    ): Promise<Review> {
        const review = await reviewRepository.createReview(TEST_VOTER_ID, input);
        await publish(review);
        return review;
    }

    @Mutation(() => Review)
    async deleteReview(@Arg('id', () => Int) id: number): Promise<Review> {
        return await reviewRepository.deleteReview(TEST_VOTER_ID, id);
    }

    @Query(() => [Review], {name: 'reviews'})
    async reviewsQuery(@Args() args: GetReviewsArgs): Promise<Review[]> {
        return await reviewRepository.findReviews(args);
    }

    @Subscription(() => Review, {topics: Topic.REVIEWING, name: 'review'})
    async reviewSubscription(
        @Arg('subcategoryId', () => Int,) subcategoryId: number,
        @Root() review: Review
    ) {
        console.log(subcategoryId);
        console.log('review', review);
        return review;
    }
}