import {Arg, Authorized, Int, Mutation, PubSub, PubSubEngine, Query, Resolver, Subscription} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CandidateRepository} from "../../repositories/candidate/candidateRepository";
import {Candidate, CandidateEditInput, CandidateInput} from "../../entities/candidate";
import {Role, Topic} from "../../utils/enums";
import {CurrentStudent} from "../../utils/currentAccount";

const candidateRepository = getCustomRepository(CandidateRepository);

@Resolver(() => Candidate)
export class CandidateResolver {
    @Authorized(Role.MANAGER)
    @Mutation(() => Candidate)
    async createCandidate(@Arg('input') input: CandidateInput): Promise<Candidate> {
        return await candidateRepository.createCandidate(input);
    }

    @Authorized()
    @Mutation(() => Candidate)
    async updateCandidate(
        @CurrentStudent() userId: number,
        @Arg('input') input: CandidateEditInput,
        @PubSub() pubSub: PubSubEngine,
    ): Promise<Candidate> {
        const candidate = await candidateRepository.editCandidate(userId, input);

        //Notify candidate.
        await pubSub.publish(
            `${Topic.CANDIDATE_PROFILE_EDITED}:${candidate.id}`,
            candidate.id
        );

        return candidate;
    }

    @Query(() => Candidate)
    async candidate(@Arg('id', () => Int) id: number): Promise<Candidate> {
        return await candidateRepository.findCandidate(id);
    }

    @Subscription(() => Candidate, {
        topics: ({args}) => `${Topic.CANDIDATE_PROFILE_EDITED}:${args.id}`,
        name: 'candidate'
    })
    async candidateSubscription(@Arg('id', () => Int) id: number): Promise<Candidate> {
        return await candidateRepository.findCandidate(id);
    }

    @Query(() => [Candidate])
    async candidates(@Arg('subcategoryId', () => Int) subcategoryId: number): Promise<Candidate[]> {
        return await candidateRepository.findCandidates(subcategoryId);
    }
}