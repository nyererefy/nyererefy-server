import '../../utils/test/initTestDb'
import {SubcategoryRepository} from "./subcategoryRepository";
import {getCustomRepository} from "typeorm";
import {Election} from "../../entities/election";
import {
    createBranch,
    createCategory,
    createElection,
    createProgram,
    createSchool,
    createUniversity,
    createUser,
    generateClasses,
    registerProgram
} from "../../utils/test/initDummyData";
import {Duration, Eligible} from "../../utils/enums";
import {User} from "../../entities/user";
import {School} from "../../entities/school";
import {Program} from "../../entities/program";
import {Branch} from "../../entities/branch";
import {University} from "../../entities/university";
import {TEST_BRANCH_ID, TEST_PROGRAM_IDENTIFIER, TEST_UNIVERSITY_ID} from "../../utils/consts";

let repository: SubcategoryRepository;
let election: Election;
let school: School;
let user: User;
let branch: Branch;
let program: Program;
let university: University;

beforeAll(async () => {
    repository = getCustomRepository(SubcategoryRepository);

    university = await createUniversity();
    branch = await createBranch(university.id);
    school = await createSchool(branch.id);
    program = await createProgram();
    await registerProgram(school.id, program.id);

    await generateClasses(university.id);

    user = await createUser(TEST_PROGRAM_IDENTIFIER);

    election = await createElection(university.id);
});

describe('Subcategory', () => {
    it('should create a new subcategory for ALL', async () => {
        await createCategory(election.id);

        const results = await repository.generateSubcategories(university.id, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should create a new subcategories for all SCHOOLS', async () => {
        await createSchool(TEST_BRANCH_ID);

        await createCategory(election.id, Eligible.SCHOOL);

        const results = await repository.generateSubcategories(university.id, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should create a new subcategories for all programs', async () => {
        const program = await createProgram(Duration.THREE_YEARS);
        const school = await createSchool(TEST_BRANCH_ID);
        await registerProgram(school.id, program.id);

        await createCategory(election.id, Eligible.PROGRAM);

        const results = await repository.generateSubcategories(university.id, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should create new subcategories for all years', async () => {
        await createCategory(election.id, Eligible.YEAR);

        const results = await repository.generateSubcategories(university.id, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should create new subcategories for all branches', async () => {
        await createBranch(TEST_UNIVERSITY_ID);
        await createCategory(election.id, Eligible.BRANCH);

        const results = await repository.generateSubcategories(university.id, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should find all election subcategories for school', async () => {
        // const categoryAll = await createCategory(election.id, Eligible.ALL);
        await createCategory(election.id, Eligible.ALL);
        // const categorySchool = await createCategory(election.id, Eligible.SCHOOL);
        await createCategory(election.id, Eligible.SCHOOL);
        await createCategory(election.id, Eligible.CLASS);
        await repository.generateSubcategories(university.id, election.id);

        const results = await repository.findEligibleElectionSubcategories(election.id, user.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    }, 10000);
});