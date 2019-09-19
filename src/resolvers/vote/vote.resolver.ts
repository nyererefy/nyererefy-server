import {Arg, ID, Mutation, Query, Resolver, Subscription} from "type-graphql";
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
    async votesQuery(@Arg('id', () => ID) id: number): Promise<Vote[]> {
        return await voteRepository.findSubcategoryVotes(id);
    }

    @Subscription(() => Vote, {topics: [Topic.VOTING], name: 'votes'})
    async votesSubscription(@Arg('id', () => ID) id: number): Promise<Vote[]> {
        return await voteRepository.findSubcategoryVotes(id);
    }
}