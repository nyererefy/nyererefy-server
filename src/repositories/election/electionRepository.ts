import {EntityRepository, Repository} from "typeorm";
import {Election, ElectionEditInput, ElectionInput} from "../../entities/election";
import {University} from "../../entities/university";

@EntityRepository(Election)
export class ElectionRepository extends Repository<Election> {
    createElection(input: ElectionInput) {
        const election = new Election();
        election.title = input.title;

        const university = new University();
        university.id = input.universityId;

        election.university = university;

        return this.save(election);
    }

    async editElection(id: number, input: ElectionEditInput) {
        let election = await this.findOne(id);
        if (!election) throw new Error('Election was not found');

        election = this.merge(election, {title: input.title});

        return this.save(election);
    }

    findElection(id: number) {
        return this.findOne(id)
    }

    findElections() {
        return this.find()
    }
}