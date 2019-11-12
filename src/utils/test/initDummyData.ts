import {getCustomRepository} from "typeorm";
import {UniversityRepository} from "../../repositories/university/universityRepository";
import {University, UniversityInput} from "../../entities/university";
import faker from "faker";
import {CategoryRepository} from "../../repositories/category/categoryRepository";
import {CategoryInput} from "../../entities/category";
import {Duration, Eligible, Year} from "../enums";
import {ElectionInput} from "../../entities/election";
import {ElectionRepository} from "../../repositories/election/electionRepository";
import {CandidateInput} from "../../entities/candidate";
import {CandidateRepository} from "../../repositories/candidate/candidateRepository";
import {RegistrationByProgramInput} from "../../entities/user";
import {UserRepository} from "../../repositories/user/userRepository";
import {SubcategoryRepository} from "../../repositories/subcategory/subcategoryRepository";
import {Subcategory} from "../../entities/subcategory";
import {SchoolRepository} from "../../repositories/school/schoolRepository";
import {School, SchoolInput} from "../../entities/school";
import {BranchRepository} from "../../repositories/branch/branchRepository";
import {Branch, BranchInput} from "../../entities/branch";
import {ProgramRepository} from "../../repositories/program/programRepository";
import {Program, ProgramInput} from "../../entities/program";
import {SchoolProgramRepository} from "../../repositories/schoolProgram/schoolProgramRepository";
import {SchoolProgram} from "../../entities/schoolProgram";
import {ClassRepository} from "../../repositories/class/classRepository";
import {Class} from "../../entities/class";
import moment from "moment";
import {TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID} from "../consts";
import {ResidenceInput} from "../../entities/residence";
import {ResidenceRepository} from "../../repositories/residence/residenceRepository";
import {RegistrationCodeRepository} from "../../repositories/registrationCode/registrationCodeRepository";
import {ManagerRepository} from "../../repositories/manager/managerRepository";
import {Manager, ManagerSignUpInput} from "../../entities/manager";

export async function createManager(email: string = faker.internet.email()): Promise<Manager> {
    const registrationCodeRepository = getCustomRepository(RegistrationCodeRepository);
    const managerRepository = getCustomRepository(ManagerRepository);

    const registrationCode = await registrationCodeRepository.generateRegistrationCode();

    const managerSignUpInput: ManagerSignUpInput = {
        name: faker.internet.userName(),
        email,
        code: registrationCode.code
    };

    return await managerRepository.createManager(managerSignUpInput);
}

export async function createUniversity(managerId: number): Promise<University> {
    const universityRepository = getCustomRepository(UniversityRepository);

    const input: UniversityInput = {
        title: faker.company.companyName(),
        abbreviation: faker.random.word(),
        webUrl: faker.internet.url(),
        bridgeUrl: faker.internet.url(),
        semesterStartsIn: 10,
        semesterEndsIn: 8
    };

    return await universityRepository.createUniversity(managerId, input);
}

export async function createBranch(universityId: number): Promise<Branch> {
    const repository = getCustomRepository(BranchRepository);

    const input: BranchInput = {
        title: faker.company.companyName(),
        abbreviation: faker.random.word(),
    };

    return await repository.createBranch(universityId, input);
}

export async function createSchool(
    branchId: number,
    title: string = faker.random.words(3),
    abbreviation?: string
): Promise<School> {
    const repository = getCustomRepository(SchoolRepository);

    const input: SchoolInput = {
        title,
        abbreviation,
        branchId
    };

    return await repository.createSchool(input);
}

export async function createProgram(
    duration = Duration.FOUR_YEARS,
    abbreviation: string = faker.random.word(),
    title: string = faker.random.words(3)): Promise<Program> {
    const repository = getCustomRepository(ProgramRepository);

    const input: ProgramInput = {title, duration, abbreviation};

    return await repository.createProgram(input);
}

export async function registerProgram(schoolId: number, programId: number, identifier: string = TEST_PROGRAM_IDENTIFIER): Promise<SchoolProgram> {
    const repository = getCustomRepository(SchoolProgramRepository);

    return await repository.registerProgram({schoolId, programId, identifier});
}

export async function generateClasses(universityId: number): Promise<Class[]> {
    const repository = getCustomRepository(ClassRepository);

    return await repository.generateClasses(universityId);
}

export async function createElection(universityId: number = TEST_UNIVERSITY_ID) {
    const electionRepository = getCustomRepository(ElectionRepository);

    const now = new Date();

    const input: ElectionInput = {
        title: faker.lorem.sentence(),
        startAt: moment(now).add(2, 'minute').toDate(),
        endAt: moment(now).add(5, 'minute').toDate(),
    };

    return await electionRepository.createElection(universityId, input);
}

export async function createCategory(electionId: number, eligible = Eligible.ALL) {
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoryInput: CategoryInput = {
        title: faker.random.words(2),
        electionId,
        eligible
    };

    return await categoryRepository.createCategory(categoryInput);
}

export async function generateSubcategories(universityId: number, electionId: number): Promise<Subcategory[]> {
    const subcategoryRepository = getCustomRepository(SubcategoryRepository);

    return await subcategoryRepository.generateSubcategories(universityId, electionId);
}

export async function createUser(
    programIdentifier: string,
    year: Year = Year.FOURTH_YEAR,
    email: string = faker.internet.email()
) {
    const userRepository = getCustomRepository(UserRepository);

    const input: RegistrationByProgramInput = {
        email,
        regNo: faker.internet.userName(),
        year,
        programIdentifier
    };

    return await userRepository.registrationByProgram(TEST_UNIVERSITY_ID, input);
}

export async function createCandidate(userId: number, subcategoryId: number) {
    const candidateRepository = getCustomRepository(CandidateRepository);

    const input: CandidateInput = {
        userId,
        subcategoryId
    };
    return await candidateRepository.createCandidate(input);
}

export async function createResidence(title: string = faker.lorem.word(), universityId: number = TEST_UNIVERSITY_ID) {
    const repository = getCustomRepository(ResidenceRepository);
    const input: ResidenceInput = {
        title
    };
    return await repository.createResidence(universityId, input);
}

export const insertDummyData = async () => {
    const program = await createProgram(Duration.FIVE_YEARS, 'MD', 'Medical Doctor');

    const manager = await createManager('teknolojia360@gmail.com');

    const university = await createUniversity(manager.id);

    const school = await createSchool(1, 'School of Medicine', 'SM');

    const registeredProgram = await registerProgram(school.id, program.id);

    await generateClasses(university.id);

    const user = await createUser(registeredProgram.identifier);
    await createUser(registeredProgram.identifier, Year.THIRD_YEAR, 'mbwamwizi@gmail.com');
    await createUser(registeredProgram.identifier, Year.FIFTH_YEAR, 'sylvakateile@gmail.com');

    const election = await createElection(university.id);
    await createCategory(election.id);
    await createCategory(election.id);

    const subcategories = await generateSubcategories(university.id, election.id);

    await createCandidate(user.id, subcategories[0].id);
};