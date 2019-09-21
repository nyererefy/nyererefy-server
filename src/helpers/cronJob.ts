import {CronJob} from "cron";
import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../repositories/election/electionRepository";

export const registerCronJobs = () => {
    // This runs every minute.
    const electionJob = new CronJob('0 */1 * * * *', async () => {
        const electionRepository = getCustomRepository(ElectionRepository);
        const states = await electionRepository.startOrStopElections();

        for (let i = 0; i < states.length; i++) {
            const state = states[i];

            if (state.isStarted) {
                //todo send notification.
                console.info(`Started ${state.election.title}`)
            }

            if (state.isClosed) {
                //todo send notification.
                console.log(`Closed ${state.election.title}`)
            }
        }
    });

    electionJob.start();
};