import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Category} from "../../entities/category";
import {Subcategory} from "../../entities/subcategory";
import {CategoryRepository} from "../category/categoryRepository";
import {SchoolRepository} from "../school/schoolRepository";
import {Eligible} from "../../utils/enums";
import {UserRepository} from "../user/userRepository";
import {ClassRepository} from "../class/classRepository";
import {ProgramRepository} from "../program/programRepository";
import {BranchRepository} from "../branch/branchRepository";

interface SaveCategoryInterface {
    categoryId: number
    ref?: number | undefined
    extraRef?: number | undefined
    title: string
    suffix: string
}

@EntityRepository(Subcategory)
export class SubcategoryRepository extends Repository<Subcategory> {
    private categoryRepository: CategoryRepository;
    private schoolRepository: SchoolRepository;
    private userRepository: UserRepository;
    private classRepository: ClassRepository;
    private programRepository: ProgramRepository;
    private branchRepository: BranchRepository;

    constructor() {
        super();
        this.categoryRepository = getCustomRepository(CategoryRepository);
        this.schoolRepository = getCustomRepository(SchoolRepository);
        this.userRepository = getCustomRepository(UserRepository);
        this.classRepository = getCustomRepository(ClassRepository);
        this.programRepository = getCustomRepository(ProgramRepository);
        this.branchRepository = getCustomRepository(BranchRepository);
    }

    async generateSubcategories(universityId: number, electionId: number): Promise<Subcategory[]> {
        const categories = await this.categoryRepository.findCategories(electionId);
        let subcategories: Subcategory[] = [];

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];

            let subcategory = new Subcategory();

            if (category.eligible === Eligible.ALL) {
                //Generate one subcategory for all of them.
                subcategory = await this.saveSubcategory({
                    title: category.title,
                    suffix: 'All',
                    categoryId: category.id
                });

                subcategories.push(subcategory);
            }

            if (category.eligible === Eligible.BRANCH) {
                //Finding all branches
                const branches = await this.branchRepository.findUniversityBranches(universityId);

                //Generate subcategories for all of them.
                for (let j = 0; j < branches.length; j++) {
                    const branch = branches[j];

                    subcategory = await this.saveSubcategory({
                        title: category.title,
                        suffix: branch.title, //todo if you encounter
                        categoryId: category.id,
                        ref: branch.id
                    });

                    subcategories.push(subcategory);
                }
            }

            if (category.eligible === Eligible.SCHOOL) {
                //Finding all schools
                const schools = await this.schoolRepository.findSchools(universityId);

                //Generate subcategories for all of them.
                for (let j = 0; j < schools.length; j++) {
                    const school = schools[j];

                    subcategory = await this.saveSubcategory({
                        title: category.title,
                        suffix: school.abbreviation || school.title,
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

            if (category.eligible === Eligible.PROGRAM) {
                //Finding all programs
                const programs = await this.programRepository.findUniversityPrograms(universityId);

                //Generate subcategories for all of them.
                for (let j = 0; j < programs.length; j++) {
                    const program = programs[j];

                    //eg all MD students
                    subcategory = await this.saveSubcategory({
                        title: category.title,
                        suffix: program.abbreviation,
                        categoryId: category.id,
                        ref: program.id
                    });

                    subcategories.push(subcategory);
                }
            }

            if (category.eligible === Eligible.YEAR) {
                //Finding all programs
                const programs = await this.programRepository.findUniversityPrograms(universityId);

                for (let j = 0; j < programs.length; j++) {
                    const program = programs[j];

                    //Generate subcategories for all of them.
                    for (let k = 0; k < program.duration; k++) {
                        const year = k + 1; //to avoid zero.

                        subcategory = await this.saveSubcategory({
                            title: category.title,
                            suffix: `${year} Year`, //todo generate 2nd 4th! lodash??
                            categoryId: category.id,
                            ref: year
                        });
                        subcategories.push(subcategory);
                    }
                }
            }
        }

        return subcategories;
    }

    private async saveSubcategory({categoryId, title, suffix, ref, extraRef}: SaveCategoryInterface) {
        const category = new Category();
        category.id = categoryId;

        let cat = await this.findOne({where: {category, ref}});

        if (cat) {
            //updating only
            cat = this.merge(cat, {title, suffix, extraRef});
            return await this.save(cat);
        }

        const subcategory = this.create({category, title, suffix, ref, extraRef});
        return await this.save(subcategory);
    }

    async findEligibleElectionSubcategories(electionId: number, userId: number): Promise<Subcategory[]> {
        const subcategories: Subcategory[] = [];
        const user = await this.userRepository.findUserInfo(userId);

        const subs = await this
            .createQueryBuilder('subcategory')
            .innerJoinAndSelect('subcategory.category', 'category')
            .innerJoinAndSelect('category.election', 'election')
            .innerJoinAndSelect('election.university', 'university')
            .where("election.id = :electionId", {electionId})
            .getMany();

        //For now we just deal with single university. That's is the reality.
        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];

            //all students in the university will see this subcategory.
            if (sub.category.eligible === Eligible.ALL &&
                sub.category.election.university.id === user.class.school.branch.university.id) {
                subcategories.push(sub)
            }

            //Means student is in same branch as eligibility requires
            if (sub.category.eligible === Eligible.BRANCH &&
                sub.ref === user.class.school.branch.id) {
                subcategories.push(sub)
            }

            //Means student is in same school as eligibility requires
            if (sub.category.eligible === Eligible.SCHOOL &&
                sub.ref === user.class.school.id) {
                subcategories.push(sub)
            }

            //Means student is in same class as eligibility requires
            if (sub.category.eligible === Eligible.CLASS &&
                sub.ref === user.class.id) {
                subcategories.push(sub)
            }

            // Means student is in same year in the same university as eligibility requires
            if (sub.category.eligible === Eligible.YEAR &&
                sub.ref === user.class.year &&
                sub.category.election.university.id === user.class.school.branch.university.id) {
                subcategories.push(sub)
            }

            //Means student studying the same program in the same university.
            if (sub.category.eligible === Eligible.PROGRAM &&
                sub.ref === user.class.program.id &&
                sub.category.election.university.id === user.class.school.branch.university.id) {
                subcategories.push(sub)
            }
        }
        return subcategories;
    }
}