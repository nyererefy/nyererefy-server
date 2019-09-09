import {EntityRepository, Repository} from "typeorm";
import {RegistrationByProgramInput, RegistrationBySchoolInput, RegistrationInput, User} from "../../entities/user";
import {Class} from "../../entities/class";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor() {
        super();
    }

    async registerUser(input: RegistrationInput): Promise<User> {
        const user = new User();

        const userClass = new Class();
        userClass.id = input.classId;

        user.class = userClass;
        user.regNo = input.regNo;
        user.email = input.email;

        return await this.save(user);
    }

    async registerUserByClass(input: RegistrationBySchoolInput | RegistrationByProgramInput): Promise<User> {
        //const university = await this.universityRepository.findUniversityByUUId(input.uuid);

        const user = new User();

        //user.university = university;
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

    async findUser(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error('User not found!')
        }
        return user;
    }

    async findUserInfo(userId: number): Promise<User> {
        const user = await this
            .createQueryBuilder('user')
            .innerJoinAndSelect('user.class', 'class')
            .innerJoinAndSelect('class.school', 'school')
            .innerJoinAndSelect('class.program', 'program')
            .leftJoinAndSelect('school.branch', 'branch')
            .where("user.id = :userId", {userId})
            .getOne();

        if (!user) {
            throw new Error('User not found!')
        }
        return user;
    }

    findUsers() {
        return this.find();
    }
}