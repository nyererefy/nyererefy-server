import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Category, CategoryEditInput} from "../../entities/category";
import {Election} from "../../entities/election";
import {Subcategory} from "../../entities/subcategory";
import {CategoryRepository} from "../category/categoryRepository";
import {SchoolRepository} from "../school/schoolRepository";
import {Eligible} from "../../utils/enums";

interface SaveCategoryInterface {
    categoryId: number
    title: string
    suffix: string
}

@EntityRepository(Subcategory)
export class SubcategoryRepository extends Repository<Subcategory> {
    private categoryRepository: CategoryRepository;
    private schoolRepository: SchoolRepository;

    constructor() {
        super();
        this.categoryRepository = getCustomRepository(CategoryRepository);
        this.schoolRepository = getCustomRepository(SchoolRepository);
    }

    async generateSubcategories(universityId: number, electionId: number): Promise<Subcategory[]> {
        //deleting all subcategories first before generating new ones.
        await this.deleteAllSubcategories(electionId);

        const categories = await this.categoryRepository.findCategories(electionId);
        let subcategories: Subcategory[] = [];

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];

            let subcategory = new Subcategory();

            //Todo add the rest eligibility.
            if (category.eligible === Eligible.ALL) {
                //Generate one subcategory for all of them.
                subcategory = await this.saveSubcategory({
                    title: category.title,
                    suffix: 'All',
                    categoryId: category.id
                });

                subcategories.push(subcategory);
            }

            if (category.eligible === Eligible.SCHOOL) {
                //Finding all schools
                const schools = await this.schoolRepository.findSchools(universityId);

                //Generate subcategories for all of them.
                for (let j = 0; j < schools.length; j++) {
                    const school = schools[j];

                    subcategory = await this.saveSubcategory({
                        title: category.title,
                        suffix: school.abbreviation,
                        categoryId: category.id
                    });

                    subcategories.push(subcategory);
                }
            }
        }

        return subcategories;
    }

    private async saveSubcategory({categoryId, title, suffix}: SaveCategoryInterface) {
        const category = new Category();
        category.id = categoryId;

        const subcategory = this.create({category, title, suffix});
        return await this.save(subcategory);
    }

    /**
     * This will delete all candidates/votes/reviews as well.
     * Todo we will need to check if election is running or has finished then we will allow.
     * @param electionId
     */
    async deleteAllSubcategories(electionId: number): Promise<Subcategory[]> {

        let subs = await this
            .createQueryBuilder('sub')
            .innerJoin('sub.category', 'cat', 'cat.electionId = :electionId', {electionId})
            .where("cat.electionId = :electionId", {electionId})
            .getMany();

        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];

            await this.createQueryBuilder()
                .delete()
                .where("id = :id", {id: sub.id})
                .execute()
        }

        return subs;
    }

    async updateCategory(input: CategoryEditInput): Promise<Subcategory> {
        let category = await this.findOne(input.categoryId);
        if (!category) throw new Error('Subcategory was not found');

        category = this.merge(category, input);

        return this.save(category);
    }

    async findCategory(id: number): Promise<Subcategory> {
        let category = await this.findOne(id);
        if (!category) throw new Error('Subcategory was not found');

        return category;
    }

    findCategories(electionId: number): Promise<Subcategory[]> {
        const election = new Election();
        election.id = electionId;

        return this.find({where: {election}})
    }

}