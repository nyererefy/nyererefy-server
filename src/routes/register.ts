import {Request, Response, Router} from "express";
import {RegistrationByProgramInput, RegistrationByProgramInputInterface} from "../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/user/userRepository";
import {UniversityRepository} from "../repositories/university/universityRepository";
import {University} from "../entities/university";

const bridgeRouter = Router();

async function validateUniversity(req: Request, res: Response): Promise<University | undefined> {
    const universityRepository = getCustomRepository(UniversityRepository);

    const CLIENT_ID = req.header('CLIENT_ID');
    const CLIENT_SECRET = req.header('CLIENT_SECRET');

    if (!CLIENT_ID || !CLIENT_SECRET) {
        res.status(401);
        return;
    }

    if (CLIENT_ID.length !== 36 || CLIENT_SECRET.length !== 64) {
        res.status(403);
        return;
    }

    return await universityRepository.validateUniversity(CLIENT_ID, CLIENT_SECRET);
}


bridgeRouter.post('/api/v1/register', async (req: Request, res: Response) => {
    try {
        const userRepository = getCustomRepository(UserRepository);

        const university = await validateUniversity(req, res);
        if (!university) {
            res.status(401).send({message: 'Unknown university/college'});
            return
        }

        const body: RegistrationByProgramInputInterface = req.body;
        const input = new RegistrationByProgramInput();

        input.regNo = body.regNo;
        input.email = body.email;
        input.programIdentifier = body.programIdentifier;
        input.year = body.year;

        const user = await userRepository.registrationByProgram(university.id, input);

        if (user) {
            res.status(200).send(
                {message: 'Your data has been sent successfully! You can now login to Nyererefy'}
            );
        }
    } catch (e) {
        res.status(403).send({
            message: 'Something went wrong and we can\'t register you right now, ' +
                'Please contact your Bridge administrator'
        })
    }
});

bridgeRouter.post('/api/v1/reset', async (req: Request, res: Response) => {
    try {
        const userRepository = getCustomRepository(UserRepository);

        const university = await validateUniversity(req, res);

        if (!university) {
            res.status(401).send({message: 'Unknown university/college'});
            return
        }

        const user = await userRepository.resetUser(req.body.regNo);

        if (user) {
            res.status(200).send({
                message: `Your account has been reset successfully`
            });
        }
    } catch (e) {
        res.status(403).send({message: 'Something went wrong, Please contact your Bridge administrator'});
    }
});

export {bridgeRouter};