import {EntityRepository, Repository} from "typeorm";
import {Branch, BranchInput} from "../../entities/branch";
import {University} from "../../entities/university";

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {
    createBranch(universityId: number, input: BranchInput) {
        const university = new University();
        university.id = universityId;

        let branch = this.create(input);
        branch = this.merge(branch, {university});

        return this.save(branch);
    }

    async editBranch(id: number, input: BranchInput) {
        let branch = await this.findOne(id);
        if (!branch) throw new Error('Branch was not found');

        branch = this.merge(branch, input);

        return this.save(branch);
    }

    async findBranch(id: number): Promise<Branch> {
        let branch = await this.findOne(id);
        if (!branch) throw new Error('Branch was not found');
        return branch;
    }

    findUniversities() {
        return this.find()
    }
}