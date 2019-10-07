import {Request, Response, Router} from "express";
import {RegistrationByProgramInput, RegistrationByProgramInputInterface} from "../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/user/userRepository";
import {UniversityRepository} from "../repositories/university/universityRepository";

const registrationRouter = Router();

registrationRouter.post('/api/v1/register', async (req: Request, res: Response) => {
    try {
        const userRepository = getCustomRepository(UserRepository);
        const universityRepository = getCustomRepository(UniversityRepository);

        const CLIENT_ID = req.header('CLIENT_ID');
        const CLIENT_SECRET = req.header('CLIENT_SECRET');

        if (!CLIENT_ID || !CLIENT_SECRET) {
            res.sendStatus(401);
            return;
        }

        if (CLIENT_ID.length !== 36 || CLIENT_SECRET.length !== 64) {
            res.sendStatus(403);
            return;
        }

        const university = await universityRepository.validateUniversity(CLIENT_ID, CLIENT_SECRET);

        const body: RegistrationByProgramInputInterface = req.body;
        const input = new RegistrationByProgramInput();

        input.regNo = body.regNo;
        input.email = body.email;
        input.programIdentifier = body.programIdentifier;
        input.year = body.year;

        const user = await userRepository.registrationByProgram(university.id, input);

        if (user) {
            res.send({
                regNo: user.regNo,
                email: user.email,
            }).sendStatus(200);
        }
    } catch (e) {
        res.send({message: 'Something went wrong, Please contact your Bridge administrator'}).sendStatus(500);
    }
});

export {registrationRouter};