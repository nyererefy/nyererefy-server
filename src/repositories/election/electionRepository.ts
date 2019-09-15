import {EntityRepository, Repository} from "typeorm";
import {Election, ElectionEditInput, ElectionInput} from "../../entities/election";
import {University} from "../../entities/university";
import _ from "lodash";

@EntityRepository(Election)
export class ElectionRepository extends Repository<Election> {
    createElection(universityId: number, input: ElectionInput) {
        const election = new Election();
        election.title = input.title;

        const university = new University();
        university.id = universityId;

        election.university = university;

        return this.save(election);
    }

    async editElection(id: number, input: ElectionEditInput) {
        let election = await this.findOne(id);
        if (!election) throw new Error('Election was not found');

        //todo this does nothing
        const updates = _.pickBy(input, v => v !== null);

        election = this.merge(election, updates);

        return this.save(election);
    }

    async findElection(id: number): Promise<Election> {
        const election = await this.findOne(id);
        if (!election) throw new Error('Election was not found');
        return election;
    }

    findElections(): Promise<Election[]> {
        return this.find()
    }
}