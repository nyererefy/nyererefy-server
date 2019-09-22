import {Arg, Int, Mutation, Query, Resolver, Subscription} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {VoteRepository} from "../../repositories/vote/voteRepository";
import {Vote, VoteInput} from "../../entities/vote";
import {Topic} from "../../utils/enums";

const voteRepository = getCustomRepository(VoteRepository);

@Resolver(() => Vote)
export class VoteResolver {
    @Mutation(() => Vote)
    async createVote(@Arg('input') input: VoteInput): Promise<Vote> {
        return await voteRepository.createVote({userId: 1, input}); //todo
    }

    @Query(() => [Vote], {name: 'votes'})
    async votesQuery(@Arg('subcategoryId', () => Int) id: number): Promise<Vote[]> {
        return await voteRepository.findSubcategoryVotes(id);
    }

    @Subscription(() => Vote, {topics: [Topic.VOTING], name: 'votes'})
    async votesSubscription(@Arg('subcategoryId', () => Int) id: number): Promise<Vote[]> {
        return await voteRepository.findSubcategoryVotes(id);
    }

    @Query(() => Int, {name: 'candidateVotesCount'})
    async candidateVotesQuery(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countCandidateVotes(id);
    }

    @Subscription(() => Int, {topics: [Topic.VOTING], name: 'candidateVotesCount'})
    async candidateVotesSubscription(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countCandidateVotes(id);
    }

    @Query(() => Int, {name: 'subcategoryVotesCount'})
    async subcategoryVotesQuery(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countSubcategoryVotes(id);
    }

    @Subscription(() => Int, {topics: [Topic.VOTING], name: 'subcategoryVotesCount'})
    async subcategoryVotesSubscription(@Arg('candidateId', () => Int) id: number): Promise<number> {
        return await voteRepository.countSubcategoryVotes(id);
    }
}