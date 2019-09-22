import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {RegistrationByProgramInput, RegistrationInput, User} from "../../entities/user";
import {SchoolProgramRepository} from "../schoolProgram/schoolProgramRepository";
import {ClassRepository} from "../class/classRepository";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    private schoolProgramRepository: SchoolProgramRepository;
    private classRepository: ClassRepository;

    constructor() {
        super();
        this.schoolProgramRepository = getCustomRepository(SchoolProgramRepository);
        this.classRepository = getCustomRepository(ClassRepository);
    }

    async registrationByProgram(universityId: number, input: RegistrationByProgramInput): Promise<User> {
        const sp = await this.schoolProgramRepository.findSchoolProgram(universityId, input.programIdentifier);
        const klass = await this.classRepository.findClass(sp.school.id, input.year, sp.program.id);

        if (sp && klass) {
            const user = new User();

            //user.university = university;
            user.regNo = input.regNo;
            user.email = input.email;
            user.class = klass;

            return await this.save(user);
        }

        throw new Error('Invalid data'); //todo be careful with this error.
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
            .innerJoinAndSelect('school.branch', 'branch')
            .innerJoinAndSelect('branch.university', 'university')
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