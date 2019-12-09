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

    /**
     * Used to make category live mainly once election ends.
     * @param electionId
     */
    async makeCategoriesLive(electionId: number) {
        const election = new Election();
        election.id = electionId;

        const categories = await this.find({where: {election}});

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];

            //If was live then no need of editing it.
            if (category.isLive) continue;

            category.isLive = true;
            await this.save(category)
        }
    }

    async findCategory(id: number): Promise<Category> {
        let category = await this.findOne(id);
        if (!category) throw new Error('Category was not found');

        return category;
    }

    async deleteCategory(id: number): Promise<Category> {
        const category = await this.findOne(id, {relations: ['election']});

        if (!category) throw new Error('Category was not found');

        if (category.election.isOpen) {
            throw new Error('Election is running, action is not allowed');
        }
        if (category.election.isCompleted) {
            throw new Error('action is not allowed for completed elections');
        }

        try {
            await this.createQueryBuilder()
                .delete()
                .where("id = :id", {id})
                .execute();
        } catch (e) {
            //todo use winston here to log this.
            throw new Error('Something went wrong, action was not allowed');
        }

        return category;
    }

    findCategories(electionId: number): Promise<Category[]> {
        const election = new Election();
        election.id = electionId;

        return this.find({where: {election}, order: {id: 'DESC'}})
    }

}