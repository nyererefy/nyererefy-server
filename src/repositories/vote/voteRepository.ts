import {EntityRepository, Repository} from "typeorm";
import {Vote, VoteInput} from "../../entities/vote";
import {Category} from "../../entities/category";
import {Student} from "../../entities/student";
import {Candidate} from "../../entities/candidate";

/**
 * Caching https://github.com/typeorm/typeorm/blob/master/docs/caching.md
 */
@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    async createVote(_input: VoteInput) {
        //Voter.
        const student = new Student();
        student.id = 1; //From session.

        //Category.
        const category = new Category();
        category.id = 1;

        //Vote
        const candidate = new Candidate();
        candidate.id = 1;

        const guard = parseInt(`${student}${category}`);

        // Checking if student has already voted
        const result: [Vote[], number] = await this.findAndCount({student, category});
        const count = result[1];

        if (count !== 0) {
            throw new Error('You already voted in this category!')
        }

        const vote = this.create({student, category, candidate, guard});

        return this.save(vote);
    }

    findVote(id: number) {
        return this.findOne(id)
    }

    findVotes() {
        return this.find()
    }

}