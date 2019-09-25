import {EntityRepository, Repository} from "typeorm";
import {Election, ElectionEditInput, ElectionInput} from "../../entities/election";
import {University} from "../../entities/university";
import _ from "lodash";
import moment from "moment";
import {CACHE_SCHEDULED_ELECTIONS_ID} from "../../utils/consts";

/**
 * useful for bringing feedback of what action has been taken.
 */
interface ElectionState {
    election: Election,
    isStarted?: boolean
    isClosed?: boolean
}

@EntityRepository(Election)
export class ElectionRepository extends Repository<Election> {
    createElection(universityId: number, input: ElectionInput) {
        if (input.startAt >= input.endAt) {
            throw new Error('Invalid election dates!')
        }

        const election = this.create(input);

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

        return await this.save(election);
    }

    async deleteElection(id: number): Promise<Election> {
        const election = await this.findOne(id);

        if (!election) throw new Error('Election was not found');

        if (election.isOpen) {
            throw new Error('Election is running, action is not allowed');
        }
        if (election.isCompleted) {
            throw new Error('action is not allowed for completed elections');
        }

        try {
            await this.createQueryBuilder()
                .delete()
                .where("id = :id", {id})
                .execute();
        } catch (e) {
            //todo use winston here to log this.
            throw new Error('Something went wrong, action was not allowed');
        }

        return election;
    }

    async findElection(id: number): Promise<Election> {
        const election = await this.findOne(id);
        if (!election) throw new Error('Election was not found');
        return election;
    }

    async startOrStopElections(): Promise<ElectionState[]> {
        const electionsState: ElectionState[] = [];
        const now = moment().toDate();

        //Finding all elections that are uncompleted.
        let elections = await this.find({
            where: {isCompleted: false},
            cache: {id: CACHE_SCHEDULED_ELECTIONS_ID, milliseconds: 10 * 60 * 1000} //10 minutes
        });

        for (let i = 0; i < elections.length; i++) {
            let election = elections[i];

            if (election.startAt <= now && !election.isOpen) {
                election.isOpen = true;
                election = await this.save(election);

                electionsState.push({election, isStarted: true});

            } else if (election.endAt <= now && election.isOpen) {
                election.isOpen = false;
                election.isCompleted = true; //So we wont find it again in next round.
                election = await this.save(election);

                electionsState.push({election, isClosed: true});
            }
        }

        return electionsState;
    }

    findElections(): Promise<Election[]> {
        return this.find()
    }
}