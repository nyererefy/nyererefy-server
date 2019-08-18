import {FieldResolver, Query, Resolver, Root} from "type-graphql";
import {User} from "../../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../../repositories/user/userRepository";
import {CandidateRepository} from "../../repositories/candidate/candidateRepository";
import {Candidate} from "../../entities/candidate";

const userRepository = getCustomRepository(UserRepository);
const candidateRepository = getCustomRepository(CandidateRepository);

@Resolver(() => Candidate)
export class CandidateResolver {
    /**
     * Can be done here or directly on entity.
     * Todo This should be on entity and eager.
     * @param user
     */
    @FieldResolver(() => User, {complexity: 4})
    async user(@Root() user: User): Promise<User> {
        return await userRepository.findUser(user.id) as User;
    }

    @Query(() => Candidate)
    async candidate(): Promise<Candidate> {
        return await candidateRepository.findCandidate(1) as Candidate;
    }

    @Query(() => [Candidate])
    async candidates(): Promise<Candidate[]> {
        return await candidateRepository.findCandidates();
    }
}