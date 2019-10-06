import {Request, Response, Router} from "express";
import {RegistrationByProgramInput, RegistrationByProgramInputInterface} from "../entities/user";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/user/userRepository";

const registrationRouter = Router();

registrationRouter.post('/api/v1/register', async (req: Request, res: Response) => {
    try {
        const userRepository = getCustomRepository(UserRepository);

        const CLIENT_ID = req.header('CLIENT_ID');
        const CLIENT_SECRET = req.header('CLIENT_SECRET');

        console.log('CLIENT_ID', CLIENT_ID);
        console.log('CLIENT_SECRET', CLIENT_SECRET);

        const body: RegistrationByProgramInputInterface = req.body;
        const input = new RegistrationByProgramInput();

        input.regNo = body.regNo;
        input.email = body.email;
        input.programIdentifier = body.programIdentifier;
        input.year = body.year;

        const user = await userRepository.registrationByProgram(1, input);

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