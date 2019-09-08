import {getCustomRepository} from "typeorm";
import {UniversityRepository} from "../../repositories/university/universityRepository";
import {University, UniversityInput} from "../../entities/university";
import faker from "faker";
import {CategoryRepository} from "../../repositories/category/categoryRepository";
import {CategoryInput} from "../../entities/category";
import {Eligible} from "../enums";
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

async function createUniversity(): Promise<University> {
    const universityRepository = getCustomRepository(UniversityRepository);

    const input: UniversityInput = {
        email: faker.internet.email(),
        title: faker.company.companyName(),
        abbreviation: faker.random.word(),
        webUrl: faker.internet.url(),
        bridgeUrl: faker.internet.url(),
    };

    return await universityRepository.createUniversity(input);
}

export async function createSchool(universityId: number): Promise<School> {
    const repository = getCustomRepository(SchoolRepository);

    const input: SchoolInput = {
        title: faker.random.words(3),
        identifier: faker.internet.userName(),
        abbreviation: faker.random.words(1)
    };

    return await repository.createSchool(universityId, input);
}

export async function createElection(universityId: number) {
    const electionRepository = getCustomRepository(ElectionRepository);

    const input: ElectionInput = {
        title: faker.lorem.sentence()
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

async function createUser(uuid: string) {
    const userRepository = getCustomRepository(UserRepository);

    const input: RegistrationInput = {
        email: faker.internet.email(),
        regNo: faker.internet.userName(),
        uuid
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
    const university = await createUniversity();

    const user1 = await createUser(university.uuid);
    await createUser(university.uuid);

    const election = await createElection(university.id);
    await createCategory(election.id);
    await createCategory(election.id);

    const subcategories = await generateSubcategories(university.id, election.id);

    await createCandidate(user1.id, subcategories[0].id);
};