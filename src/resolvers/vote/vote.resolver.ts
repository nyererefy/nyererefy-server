import {Arg, Args, Authorized, Int, Mutation, PubSub, Query, Resolver, Root, Subscription} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {VoteRepository} from "../../repositories/vote/voteRepository";
import {GetVotesArgs, Vote, VoteInput} from "../../entities/vote";
import {Topic} from "../../utils/enums";
import {PubSubEngine} from "apollo-server-express";
import {CurrentStudent} from "../../utils/currentAccount";

const voteRepository = getCustomRepository(VoteRepository);

@Resolver(() => Vote)
export class VoteResolver {
    @Authorized()
    @Mutation(() => Vote)
    async createVote(
        @Arg('input') input: VoteInput,
        @PubSub() pubSub: PubSubEngine,
        @CurrentStudent() userId: number
    ): Promise<Vote> {
        const vote = await voteRepository.createVote({userId, input});

        //notifying subscribers about added vote.
        await pubSub.publish(
            `${Topic.VOTE_ADDED}:${vote.subcategory.id}`,
            vote.id
        );

        //In order to recount candidate's votes.
        await pubSub.publish(
            `${Topic.CANDIDATE_VOTE_ADDED}:${vote.candidate.id}`,
            vote.candidate.id
        );

        //In order to recount all subcategory's vote.
        await pubSub.publish(
            `${Topic.SUBCATEGORY_VOTE_ADDED}:${vote.subcategory.id}`,
            vote.subcategory.id
        );

        return vote;
    }

    @Subscription(() => Vote, {
        topics: ({args}) => `${Topic.VOTE_ADDED}:${args.subcategoryId}`,
        name: 'vote'
    })
    async voteSubscription(
        @Arg('subcategoryId', () => Int) _subcategoryId: number,
        @Root() voteId: number
    ): Promise<Vote> {
        return await voteRepository.findVote(voteId)
    }

    @Subscription(() => Int, {
        topics: ({args}) => `${Topic.CANDIDATE_VOTE_ADDED}:${args.candidateId}`,
        name: 'candidateVotesCount'
    })
    async candidateVotesSubscription(@Arg('candidateId', () => Int) candidateId: number): Promise<number> {
        return await voteRepository.countCandidateVotes(candidateId);
    }

    @Subscription(() => Int, {
        topics: ({args}) => `${Topic.SUBCATEGORY_VOTE_ADDED}:${args.subcategoryId}`,
        name: 'subcategoryVotesCount'
    })
    async subcategoryVotesSubscription(@Arg('subcategoryId', () => Int) subcategoryId: number): Promise<number> {
        return await voteRepository.countSubcategoryVotes(subcategoryId);
    }

    @Query(() => Int, {name: 'candidateVotesCount'})
    async candidateVotesQuery(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countCandidateVotes(id);
    }

    @Query(() => Int, {name: 'subcategoryVotesCount'})
    async subcategoryVotesQuery(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countSubcategoryVotes(id);
    }

    @Query(() => [Vote], {name: 'votes'})
    async votesQuery(@Args() args: GetVotesArgs): Promise<Vote[]> {
        return await voteRepository.findSubcategoryVotes(args);
    }
}