import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Category, CategoryEditInput} from "../../entities/category";
import {Subcategory} from "../../entities/subcategory";
import {CategoryRepository} from "../category/categoryRepository";
import {SchoolRepository} from "../school/schoolRepository";
import {Eligible} from "../../utils/enums";
import {UserRepository} from "../user/userRepository";
import {ClassRepository} from "../class/classRepository";

interface SaveCategoryInterface {
    categoryId: number
    ref?: number | undefined
    title: string
    suffix: string
}

@EntityRepository(Subcategory)
export class SubcategoryRepository extends Repository<Subcategory> {
    private categoryRepository: CategoryRepository;
    private schoolRepository: SchoolRepository;
    private userRepository: UserRepository;
    private classRepository: ClassRepository;

    constructor() {
        super();
        this.categoryRepository = getCustomRepository(CategoryRepository);
        this.schoolRepository = getCustomRepository(SchoolRepository);
        this.userRepository = getCustomRepository(UserRepository);
        this.classRepository = getCustomRepository(ClassRepository);
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
                        categoryId: category.id,
                        ref: school.id
                    });

                    subcategories.push(subcategory);
                }
            }

            if (category.eligible === Eligible.CLASS) {
                //Finding all classes
                const classes = await this.classRepository.findUniversityClasses(universityId);

                //Generate subcategories for all of them.
                for (let j = 0; j < classes.length; j++) {
                    const klass = classes[j];

                    subcategory = await this.saveSubcategory({
                        title: category.title,
                        suffix: klass.title,
                        categoryId: category.id,
                        ref: klass.id
                    });

                    subcategories.push(subcategory);
                }
            }
        }

        return subcategories;
    }

    private async saveSubcategory({categoryId, title, suffix, ref}: SaveCategoryInterface) {
        const category = new Category();
        category.id = categoryId;

        const subcategory = this.create({category, title, suffix, ref});
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

    async findEligibleElectionSubcategories(electionId: number, userId: number): Promise<Subcategory[]> {
        const subcategories: Subcategory[] = [];
        const user = await this.userRepository.findUserInfo(userId);

        const subs = await this
            .createQueryBuilder('sub')
            .innerJoinAndSelect('sub.category', 'cat')
            .where("cat.electionId = :electionId", {electionId})
            .getMany();

        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];

            //all student will see this subcategory.
            if (sub.category.eligible === Eligible.ALL) {
                subcategories.push(sub)
            }

            //Means student is in same branch as eligibility requires
            if (sub.category.eligible === Eligible.BRANCH && sub.ref === user.class.school.branch.id) {
                subcategories.push(sub)
            }

            //Means student is in same school as eligibility requires
            if (sub.category.eligible === Eligible.SCHOOL && sub.ref === user.class.school.id) {
                subcategories.push(sub)
            }

            //Means student is in same class as eligibility requires
            if (sub.category.eligible === Eligible.CLASS && sub.ref === user.class.id) {
                subcategories.push(sub)
            }

            //Means student is in same year as eligibility requires
            if (sub.category.eligible === Eligible.YEAR && sub.ref === user.class.year) {
                subcategories.push(sub)
            }

            //Means student is in same year as eligibility requires
            if (sub.category.eligible === Eligible.PROGRAM && sub.ref === user.class.program.id) {
                subcategories.push(sub)
            }
        }
        //todo for sex loop all pushed categories and get sex extra-eligibility categories.
        return subcategories;
    }
}