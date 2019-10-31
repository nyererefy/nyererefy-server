import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {GetUsersArgs, RegistrationByProgramInput, RegistrationInput, User, UserSetupInput} from "../../entities/user";
import {SchoolProgramRepository} from "../schoolProgram/schoolProgramRepository";
import {ClassRepository} from "../class/classRepository";
import {OrderBy} from "../../utils/enums";
import {formatRegNo} from "../../helpers/regNo";
import bcrypt from "bcryptjs"
import {ResidenceRepository} from "../residence/residenceRepository";

interface PassportDataInterface {
    accessToken: string,
    refreshToken: string,
    profile: any
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    private schoolProgramRepository: SchoolProgramRepository;
    private classRepository: ClassRepository;
    private residenceRepository: ResidenceRepository;

    constructor() {
        super();
        this.schoolProgramRepository = getCustomRepository(SchoolProgramRepository);
        this.classRepository = getCustomRepository(ClassRepository);
        this.residenceRepository = getCustomRepository(ResidenceRepository);
    }

    async registrationByProgram(universityId: number, input: RegistrationByProgramInput): Promise<User> {
        const sp = await this.schoolProgramRepository.findSchoolProgram(universityId, input.programIdentifier);
        const klass = await this.classRepository.findClass(sp.school.id, input.year, sp.program.id);

        if (sp && klass) {
            const user = new User();

            const regNo = formatRegNo(input.regNo);

            user.regNo = regNo;
            user.email = input.email;
            user.class = klass;

            //Just regNo because email could change. So regNo is the one maintaining student identity.
            const student = await this.findOne({
                where: {regNo}
            });

            //Try & catch because email can be duplicated and throw mysql error.
            try {
                if (student) {
                    //This means students have not verified their data so we can just update them.
                    if (!student.isDataConfirmed) {
                        await this.update(student.id, user);
                    }
                    return student;
                }
                return await this.save(user);
            } catch (e) {
                //todo use logger here.
                throw new Error('Change your email address please!');
            }
        }

        throw new Error('Invalid data, Please contact your bridge administrator');
    }

    editUser(input: RegistrationInput) {
        const user = this.create(input);
        return this.save(user);
    }

    async confirmData(id: number) {
        let user = await this.findUser(id);

        user.isDataConfirmed = true;

        return await this.save(user);
    }

    async setupUser(id: number, input: UserSetupInput) {
        let user = await this.findUser(id);

        // Student must confirm if their data is correct.
        if (!user.isDataConfirmed) {
            throw new Error('You have not confirmed your data yet!')
        }

        // If profile is set we can't set it up.
        if (user.isAccountSet) {
            throw new Error('Profile is already set!')
        }

        const username = input.username;

        const existing = await this.findOne({where: {username}});

        if (existing && existing.id !== user.id) {
            throw new Error(`${username} is taken!, Please choose another one`)
        }

        const password = await bcrypt.hash(input.password, 8);

        user.name = input.name;
        user.username = username;
        user.sex = input.sex;
        user.password = password;
        user.isAccountSet = true;

        return await this.save(user);
    }

    async loginWithGoogle({profile, accessToken}: PassportDataInterface) {
        const email = profile.emails[0].value || profile._json.email;

        const user = await this.findStudentByEmail(email);

        //If user has already accepts how his data looks like, there is no need to update it.
        if (!user.isAccountSet) {
            await this.update(user.id, {
                name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
                token: accessToken,
                avatar: profile._json.picture
            });
        }
        return user;
    }

    async findStudentByEmail(email: string): Promise<User> {
        const user = await this
            .createQueryBuilder('user')
            .innerJoinAndSelect('user.class', 'class')
            .innerJoinAndSelect('class.school', 'school')
            .innerJoinAndSelect('school.branch', 'branch')
            .innerJoinAndSelect('branch.university', 'university')
            .where("user.email = :email", {email})
            .getOne();

        if (!user) {
            throw new Error(`account associated with this email: ${email} was not found!`)
        }

        return user;
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

    findUsers({query, offset = 0, limit = 10, orderBy = OrderBy.DESC}: GetUsersArgs): Promise<User[]> {
        const q = this.createQueryBuilder('user')
            .skip(offset)
            .limit(limit)
            .orderBy('user.id', orderBy);

        if (query) {
            q
                .where('user.name like :query', {query: `%${query}%`})
                .orWhere('user.regNo like :query', {query: `%${query}%`})
        }

        return q.getMany()

    }

    async updateResidence(userId: number, residenceId: number) {
        const user = await this.findUser(userId);
        user.residence = await this.residenceRepository.findResidence(residenceId);

        return await this.save(user);
    }
}