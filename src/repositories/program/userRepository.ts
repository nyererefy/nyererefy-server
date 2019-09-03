import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {RegistrationByProgramInput, RegistrationBySchoolInput, RegistrationInput, User} from "../../entities/user";
import {UniversityRepository} from "../university/universityRepository";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private universityRepository: UniversityRepository;

    constructor() {
        super();
        this.universityRepository = getCustomRepository(UniversityRepository)
    }

    async registerUser(input: RegistrationInput): Promise<User> {
        const university = await this.universityRepository.findUniversityByUUId(input.uuid);

        const user = new User();

        user.university = university;
        user.regNo = input.regNo;
        user.email = input.email;

        return await this.save(user);
    }

    async registerUserByClass(input: RegistrationBySchoolInput | RegistrationByProgramInput): Promise<User> {
        const university = await this.universityRepository.findUniversityByUUId(input.uuid);

        const user = new User();

        user.university = university;
        user.regNo = input.regNo;
        user.email = input.email;

        if (input instanceof RegistrationBySchoolInput) {
            input.schoolIdentifier
        }

        if (input instanceof RegistrationByProgramInput) {

        }

        return await this.save(user);
    }

    editUser(input: RegistrationInput) {
        const user = this.create(input);
        return this.save(user);
    }

    findUser(id: number) {
        return this.findOne(id);
    }

    findUsers() {
        return this.find();
    }
}