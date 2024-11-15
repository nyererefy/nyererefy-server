import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {
    GetUsersArgs,
    RegistrationByProgramInput,
    RegistrationInput,
    User,
    UserAvatarInput,
    UserSetupInput
} from "../../entities/user";
import {SchoolProgramRepository} from "../schoolProgram/schoolProgramRepository";
import {ClassRepository} from "../class/classRepository";
import {OrderBy} from "../../utils/enums";
import {formatRegNo} from "../../helpers/regNo";
import bcrypt from "bcryptjs"
import {ResidenceRepository} from "../residence/residenceRepository";
import {ElectionRepository} from "../election/electionRepository";
import {deleteObject, uploadImage, uploadImageFromUrl} from "../../helpers/avatar";
import {notifyUser} from "../../helpers/notification";
import {sendEmail} from "../../helpers/mail";
import {ACCOUNT_RESET_EMAIL, WELCOME_EMAIL} from "../../utils/emails";

export interface PassportDataInterface {
    accessToken: string,
    refreshToken: string,
    profile: any
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    private schoolProgramRepository: SchoolProgramRepository;
    private classRepository: ClassRepository;
    private residenceRepository: ResidenceRepository;
    private electionRepository: ElectionRepository;

    constructor() {
        super();
        this.schoolProgramRepository = getCustomRepository(SchoolProgramRepository);
        this.classRepository = getCustomRepository(ClassRepository);
        this.residenceRepository = getCustomRepository(ResidenceRepository);
        this.electionRepository = getCustomRepository(ElectionRepository);
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
                const createdUser = await this.save(user);

                if (createdUser) {
                    await sendEmail({
                        to: createdUser.email,
                        subject: `Welcome to Nyererefy`,
                        html: WELCOME_EMAIL
                    });
                }
                return createdUser;
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

        const pin = await bcrypt.hash(input.pin, 8);

        user.name = input.name;
        user.username = username;
        user.sex = input.sex;
        user.pin = pin;
        user.isAccountSet = true;

        return await this.save(user);
    }

    async resetUser(regNo: string) {
        let user = await this.findOne({where: {regNo}});

        if (!user) {
            throw new Error('account was not found!')
        }

        user.isDataConfirmed = false;
        user.isAccountSet = false;

        user = await this.save(user);

        //Notify user
        await notifyUser({
                userId: user.id,
                title: `Your account has been reset, Please Re-login to set it up`,
                body: "Thank you"
            }
        );

        await sendEmail({
            to: user.email,
            subject: `Your account has been reset`,
            html: ACCOUNT_RESET_EMAIL
        });
        return user;
    }

    async loginWithGoogle({profile, accessToken}: PassportDataInterface) {
        const email = profile.emails[0].value || profile._json.email;

        const user = await this.findStudentByEmail(email);

        //If user has already accepts how his data looks like, there is no need to update it.
        if (!user.isAccountSet) {
            const previousAvatar = user.avatar;

            user.name = profile.displayName || `${profile.familyName} ${profile.givenName}`;
            user.token = accessToken;
            user.avatar = await uploadImageFromUrl(profile._json.picture);

            if (previousAvatar) {
                await deleteObject(previousAvatar);
            }
            return await this.save(user)
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
            .leftJoinAndSelect('user.residence', 'residence')
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

    async updateResidence(userId: number, residenceId: number, universityId: number) {
        const user = await this.findUser(userId);

        //Check if there is any election running
        const count = await this.electionRepository.countOpenedElections(universityId);

        if (count > 0) {
            throw new Error('action is not allowed while there are elections running')
        }

        user.residence = await this.residenceRepository.findResidence(residenceId);

        return await this.save(user);
    }

    async updateAvatar(userId: number, input: UserAvatarInput): Promise<User> {
        let user = await this.findUser(userId);

        const newAvatar = await uploadImage(input.avatar);

        if (newAvatar) {
            const previousAvatar = user.avatar;
            user.avatar = newAvatar;

            if (previousAvatar) {
                await deleteObject(previousAvatar);
            }

            return await this.save(user);
        }

        throw new Error('Something went wrong try again later!')
    }

    /**
     * Used to verify if user is exactly the one with account especially during voting.
     * @param userId
     * @param password
     */
    async verifyPassword(userId: number, password: string) {
        let user = await this.findUser(userId);

        const dbPassword = user.pin;

        if (!dbPassword) {
            throw new Error('You need to set pin first!')
        }

        const result = await bcrypt.compare(password, dbPassword);

        if (!result) {
            throw new Error('You entered wrong Password!')
        }

        return result
    }

    async countUsers(_universityId?: number) {
        return await this.count()
    }

    async findAllUsersEmails() {
        return await this.find({select: ["email"]})
    }

}