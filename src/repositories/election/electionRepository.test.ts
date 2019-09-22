import '../../utils/test/initTestDb'
import {ElectionRepository} from "./electionRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {ElectionEditInput, ElectionInput} from "../../entities/election";
import moment from "moment";

let repository: ElectionRepository;
const universityId = 1;
const electionId = 1;

beforeEach(async () => {
    repository = getCustomRepository(ElectionRepository);
});

describe('Election', () => {
    it('should create a new election', async () => {
        const now = new Date();

        const input: ElectionInput = {
            title: faker.lorem.sentence(),
            startAt: moment(now).add(1, 'minute').toDate(),
            endAt: moment(now).add(3, 'minute').toDate(),
        };

        const result = await repository.createElection(universityId, input);

        expect(result.title).toMatch(input.title)
    });

    it('should edit an election', async () => {
        const input: ElectionEditInput = {
            title: faker.lorem.sentence()
        };
        const result = await repository.editElection(electionId, input);

        await expect(result).toMatchObject({
            id: electionId,
            title: input.title
        })
    });

    it('should find election', async () => {
        const result = await repository.findElection(electionId);
        expect(result).toBeDefined();
    });

    it('should find elections', async () => {
        const results = await repository.findElections();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    // it('should start an election', async () => {
    //     const now = new Date();
    //
    //     const input: ElectionInput = {
    //         title: faker.lorem.sentence(),
    //         startAt: moment(now).subtract(1, 'hour').toDate(),
    //         endAt: moment(now).add(1, 'hour').toDate(),
    //     };
    //
    //     const election = await repository.createElection(universityId, input);
    //
    //     const results = await repository.startOrStopElections();
    //
    //     expect(results).toContainEqual(
    //         expect.objectContaining({
    //             election: {
    //                 id: election.id,
    //                 isOpen: true
    //             },
    //             isStarted: true
    //         })
    //     )
    // });
    //
    // it('should stop an election and complete election', async () => {
    //     const now = new Date();
    //
    //     const input: ElectionInput = {
    //         title: faker.lorem.sentence(),
    //         startAt: moment(now).subtract(1, 'hour').toDate(),
    //         endAt: moment(now).subtract(1, 'hour').toDate(),
    //     };
    //
    //     const election = await repository.createElection(universityId, input);
    //
    //     await repository.editElection(election.id, {isOpen: true});
    //
    //     const results = await repository.startOrStopElections();
    //
    //     expect(results).toContainEqual(
    //         expect.objectContaining({
    //             election: {
    //                 id: election.id,
    //                 isOpen: true
    //             },
    //             isStarted: true
    //         })
    //     )
    // });
});