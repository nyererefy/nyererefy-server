import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {CandidateRepository} from "../../repositories/candidate/candidateRepository";
import {Candidate, CandidateInput} from "../../entities/candidate";

const candidateRepository = getCustomRepository(CandidateRepository);

@Resolver(() => Candidate)
export class CandidateResolver {
    @Mutation(() => Candidate)
    async createCandidate(@Arg('input') input: CandidateInput): Promise<Candidate> {
        return await candidateRepository.createCandidate(input);
    }

    @Query(() => Candidate)
    async candidate(@Arg('id', () => Int) id: number): Promise<Candidate> {
        return await candidateRepository.findCandidate(id);
    }

    @Query(() => [Candidate])
    async candidates(@Arg('subcategoryId', () => Int) subcategoryId: number): Promise<Candidate[]> {
        return await candidateRepository.findCandidates(subcategoryId);
    }
}