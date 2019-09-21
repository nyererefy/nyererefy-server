import {getCustomRepository} from "typeorm";
import {UniversityRepository} from "../../repositories/university/universityRepository";
import {University, UniversityInput} from "../../entities/university";
import faker from "faker";
import {CategoryRepository} from "../../repositories/category/categoryRepository";
import {CategoryInput} from "../../entities/category";
import {Duration, Eligible} from "../enums";
import {ElectionInput} from "../../entities/election";
import {ElectionRepository} from "../../repositories/election/electionRepository";
import {CandidateInput} from "../../entities/candidate";
import {CandidateRepository} from "../../repositories/candidate/candidateRepository";
import {RegistrationInput} from "../../entities/user";
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

export async function createUniversity(): Promise<University> {
    const universityRepository = getCustomRepository(UniversityRepository);

    const input: UniversityInput = {
        email: faker.internet.email(),
        title: faker.company.companyName(),
        abbreviation: faker.random.word(),
        webUrl: faker.internet.url(),
        bridgeUrl: faker.internet.url(),
        semesterStartsIn: 10,
        semesterEndsIn: 8
    };

    return await universityRepository.createUniversity(input);
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
        identifier: faker.internet.userName(),
        abbreviation,
        branchId
    };

    return await repository.createSchool(input);
}

export async function createProgram(duration = Duration.FOUR_YEARS, abbreviation: string = faker.random.word()): Promise<Program> {
    const repository = getCustomRepository(ProgramRepository);

    const input: ProgramInput = {
        title: faker.random.words(3),
        duration,
        abbreviation,
    };

    return await repository.createProgram(input);
}

export async function registerProgram(schoolId: number, programId: number): Promise<SchoolProgram> {
    const repository = getCustomRepository(SchoolProgramRepository);

    return await repository.registerProgram({schoolId, programId});
}

export async function generateClasses(universityId: number): Promise<Class[]> {
    const repository = getCustomRepository(ClassRepository);

    return await repository.generateClasses(universityId);
}

export async function createElection(universityId: number) {
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

export async function createUser(classId: number) {
    const userRepository = getCustomRepository(UserRepository);

    const input: RegistrationInput = {
        email: faker.internet.email(),
        regNo: faker.internet.userName(),
        classId
    };

    return await userRepository.registerUser(input);
}

export async function createCandidate(userId: number, subcategoryId: number) {
    const candidateRepository = getCustomRepository(CandidateRepository);

    const input: CandidateInput = {
        userId,
        subcategoryId
    };
    return await candidateRepository.createCandidate(input);
}

export const insertDummyData = async () => {
    const program = await createProgram();

    const university = await createUniversity();

    const branch = await createBranch(university.id);

    const school = await createSchool(branch.id, 'School of Medicine', 'SM');

    await registerProgram(school.id, program.id);

    const classes = await generateClasses(university.id);

    const user1 = await createUser(classes[0].id);
    await createUser(classes[0].id);
    await createUser(classes[0].id);

    const election = await createElection(university.id);
    await createCategory(election.id);
    await createCategory(election.id);

    const subcategories = await generateSubcategories(university.id, election.id);

    await createCandidate(user1.id, subcategories[0].id);
};