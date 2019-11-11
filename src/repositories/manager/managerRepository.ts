import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Manager, ManagerSignUpInput} from "../../entities/manager";
import {RegistrationCodeRepository} from "../registrationCode/registrationCodeRepository";
import {PassportDataInterface} from "../user/userRepository";

@EntityRepository(Manager)
export class ManagerRepository extends Repository<Manager> {
    private registrationCodeRepository: RegistrationCodeRepository;

    constructor() {
        super();
        this.registrationCodeRepository = getCustomRepository(RegistrationCodeRepository);
    }

    async createManager(input: ManagerSignUpInput) {
        let manager = this.create(input);

        await this.registrationCodeRepository.findRegistrationCode(input.code);

        return this.save(manager);
    }

    async signUpWithGoogle({profile, accessToken}: PassportDataInterface, code: string) {
        const email = profile.emails[0].value || profile._json.email;
        let manager = await this.findOne({where: {email}});

        if (!manager) {
            const cd = await this.registrationCodeRepository.findRegistrationCode(code);

            const mng = new Manager();
            mng.email = email;
            mng.name = profile.displayName || `${profile.familyName} ${profile.givenName}`;
            mng.token = accessToken;

            const savedManager = await this.save(mng);

            if (savedManager) {
                //deleting reg code since it can only be used once.
                await this.registrationCodeRepository.deleteRegistrationCode(cd.id);
                return savedManager;
            }
        }
        throw new Error('Email is used already')
    }

    async loginWithGoogle({profile}: PassportDataInterface) {
        const email = profile.emails[0].value || profile._json.email;
        return await this.findManagerByEmail(email);
    }

    async findManager(id: number): Promise<Manager> {
        let manager = await this.findOne(id);
        if (!manager) throw new Error('Manager was not found');
        return manager;
    }

    async findManagerByEmail(email: string): Promise<Manager> {
        let manager = await this.findOne({email});
        if (!manager) throw new Error('Manager was not found');
        return manager;
    }
}