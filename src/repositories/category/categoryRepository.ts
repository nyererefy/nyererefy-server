import {EntityRepository, Repository} from "typeorm";
import {Category, CategoryEditInput, CategoryInput} from "../../entities/category";
import {Election} from "../../entities/election";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    createCategory(input: CategoryInput) {
        //Associated election
        const election = new Election();
        election.id = input.electionId;

        let category = this.create(input);
        category = this.merge(category, {election});

        return this.save(category);
    }

    async editCategory(id: number, input: CategoryEditInput) {
        let category = await this.findOne(id);
        if (!category) throw new Error('Category was not found');

        category = this.merge(category, input);

        return this.save(category);
    }

    findCategory(id: number) {
        return this.findOne(id)
    }

    findCategories() {
        return this.find()
    }

}