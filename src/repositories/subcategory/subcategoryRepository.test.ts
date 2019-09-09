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
import {Eligible} from "../../utils/enums";
import {User} from "../../entities/user";
import {School} from "../../entities/school";
import {Program} from "../../entities/program";
import {Class} from "../../entities/class";
import {Branch} from "../../entities/branch";
import {University} from "../../entities/university";

let repository: SubcategoryRepository;
let election: Election;
let school: School;
let user: User;
let branch: Branch;
let classes: Class[];
let klass: Class;
let program: Program;
let university: University;

beforeAll(async () => {
    repository = getCustomRepository(SubcategoryRepository);

    university = await createUniversity();
    branch = await createBranch(university.id);
    school = await createSchool(branch.id);
    program = await createProgram();
    await registerProgram(school.id, program.id);

    classes = await generateClasses(university.id, school.id);
    klass = classes[0];

    user = await createUser(klass.id);

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
        await createSchool(university.id);

        await createCategory(election.id, Eligible.SCHOOL);

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

        console.log(results);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should delete all election subcategories', async () => {
        const results = await repository.deleteAllSubcategories(1);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });


});