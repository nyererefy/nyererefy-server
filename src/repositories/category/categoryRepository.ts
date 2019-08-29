import {EntityRepository, Repository} from "typeorm";
import {Category, CategoryEditInput, CategoryInput} from "../../entities/category";
import {Election} from "../../entities/election";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    createCategory(input: CategoryInput): Promise<Category> {
        //Todo make sure election belongs to right owner.
        //Associated election
        const election = new Election();
        election.id = input.electionId;

        let category = this.create(input);
        category = this.merge(category, {election});

        return this.save(category);
    }

    async updateCategory(input: CategoryEditInput): Promise<Category> {
        let category = await this.findOne(input.categoryId);
        if (!category) throw new Error('Category was not found');

        category = this.merge(category, input);

        return this.save(category);
    }

    async findCategory(id: number): Promise<Category> {
        let category = await this.findOne(id);
        if (!category) throw new Error('Category was not found');

        return category;
    }

    findCategories(electionId: number): Promise<Category[]> {
        const election = new Election();
        election.id = electionId;

        return this.find({where: {election}})
    }

}