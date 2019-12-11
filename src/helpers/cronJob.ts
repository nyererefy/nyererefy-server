import {CronJob} from "cron";
import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../repositories/election/electionRepository";
import {CategoryRepository} from "../repositories/category/categoryRepository";
import {notifyAll} from "./notification";

export const registerCronJobs = () => {
    // This runs every minute.
    const electionJob = new CronJob('0 */1 * * * *', async () => {
        const electionRepository = getCustomRepository(ElectionRepository);
        const categoryRepository = getCustomRepository(CategoryRepository);
        const states = await electionRepository.startOrStopElections();

        for (let i = 0; i < states.length; i++) {
            const state = states[i];

            if (state.isStarted) {
                //Notify user
                await notifyAll({
                        title: `${state.election.title} has started.`,
                        body: `${state.election.title} has started, You can now vote for your favourite candidates.`
                    }
                );
            }

            if (state.isClosed) {
                //Releasing results.
                await categoryRepository.makeCategoriesLive(state.election.id);

                //Notify user
                await notifyAll({
                        title: `${state.election.title} has ended.`,
                        body: `${state.election.title} has ended and all results have been released.`
                    }
                );
            }
        }
    });

    electionJob.start();
};