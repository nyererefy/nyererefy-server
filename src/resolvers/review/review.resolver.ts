import {ReviewRepository} from "../../repositories/review/reviewRepository";
import {GetReviewsArgs, Review, ReviewInput} from "../../entities/review";
import {Arg, Args, Authorized, Int, Mutation, PubSub, Query, Resolver, Root, Subscription} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {PubSubEngine} from "apollo-server-express";
import {Topic} from "../../utils/enums";
import {CurrentStudent} from "../../utils/currentAccount";

const reviewRepository = getCustomRepository(ReviewRepository);

@Resolver(() => Review)
export class ReviewResolver {
    /**
     * We are using subcategoryId as topic/trigger name
     * @param input
     * @param pubSub
     * @param studentId
     */
    @Authorized()
    @Mutation(() => Review)
    async createReview(
        @Arg('input') input: ReviewInput,
        @PubSub() pubSub: PubSubEngine,
        @CurrentStudent() studentId: number
    ): Promise<Review> {
        const review = await reviewRepository.createReview(studentId, input);
        await pubSub.publish(`${Topic.REVIEW_ADDED}:${input.subcategoryId}`, review.id);
        return review;
    }

    /**
     * @param _subcategoryId
     * @param reviewId
     */
    @Subscription(() => Review, {topics: ({args}) => `${Topic.REVIEW_ADDED}:${args.subcategoryId}`, name: 'review'})
    async reviewSubscription(
        @Arg('subcategoryId', () => Int) _subcategoryId: number,
        @Root() reviewId: number
    ): Promise<Review> {
        //todo check if subcategoryId is valid. or leave them waiting for boat at airport.
        return reviewRepository.findReview(reviewId);
    }

    @Authorized()
    @Mutation(() => Review)
    async deleteReview(
        @Arg('id', () => Int) id: number,
        @CurrentStudent() studentId: number
    ): Promise<Review> {
        return await reviewRepository.deleteReview(studentId, id);
    }

    @Query(() => [Review], {name: 'reviews'})
    async reviewsQuery(@Args() args: GetReviewsArgs): Promise<Review[]> {
        return await reviewRepository.findReviews(args);
    }
}