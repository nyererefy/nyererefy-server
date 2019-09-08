import '../../utils/test/initTestDb'
import {SubcategoryRepository} from "./subcategoryRepository";
import {getCustomRepository} from "typeorm";
import {Election} from "../../entities/election";
import {createCategory, createElection, createSchool} from "../../utils/test/initDummyData";
import {Eligible} from "../../utils/enums";

let repository: SubcategoryRepository;
let election: Election;
const universityId: number = 1;

beforeEach(async () => {
    repository = getCustomRepository(SubcategoryRepository);
    election = await createElection(universityId);
});

describe('Subcategory', () => {
    it('should create a new subcategory for ALL', async () => {
        await createCategory(election.id);

        const results = await repository.generateSubcategories(universityId, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should create a new subcategory for all SCHOOLS', async () => {
        await createSchool(universityId);
        await createSchool(universityId);

        await createCategory(election.id, Eligible.SCHOOL);

        const results = await repository.generateSubcategories(universityId, election.id);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });

    it('should delete all election subcategories', async () => {
        const results = await repository.deleteAllSubcategories(1);

        console.log(results);

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});