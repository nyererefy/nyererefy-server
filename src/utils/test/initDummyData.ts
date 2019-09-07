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

async function createElection(universityId: number) {
    const electionRepository = getCustomRepository(ElectionRepository);

    const input: ElectionInput = {
        title: faker.lorem.sentence()
    };

    return await electionRepository.createElection(universityId, input);
}

export async function createCategory(electionId: number) {
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoryInput: CategoryInput = {
        title: faker.random.words(2),
        electionId,
        eligible: Eligible.ALL
    };

    return await categoryRepository.createCategory(categoryInput);
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

export async function createCandidate(userId: number, categoryId: number) {
    const candidateRepository = getCustomRepository(CandidateRepository);

    const input: CandidateInput = {
        userId,
        categoryId
    };
    return await candidateRepository.createCandidate(input);
}

export const insertDummyData = async () => {
    const university = await createUniversity();

    const user1 = await createUser(university.uuid);
    await createUser(university.uuid);

    const election = await createElection(university.id);
    const category = await createCategory(election.id);

    await createCandidate(user1.id, category.id);
};