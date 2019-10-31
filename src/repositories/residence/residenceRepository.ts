import {EntityRepository, Repository} from "typeorm";
import {Residence, ResidenceInput} from "../../entities/residence";
import {University} from "../../entities/university";


@EntityRepository(Residence)
export class ResidenceRepository extends Repository<Residence> {
    createResidence(universityId: number, input: ResidenceInput) {
        const residence = this.create(input);

        const university = new University();
        university.id = universityId;

        residence.university = university;

        return this.save(residence);
    }

    async editResidence(id: number, universityId: number, input: ResidenceInput) {
        const university = new University();
        university.id = universityId;

        let residence = await this.findOne({where: {id, university}});

        if (!residence) throw new Error('Residence was not found');

        residence = this.merge(residence, input);

        return await this.save(residence);
    }

    async deleteResidence(id: number, universityId: number): Promise<Residence> {
        const university = new University();
        university.id = universityId;

        const residence = await this.findOne({where: {id, university}});

        if (!residence) throw new Error('Residence was not found');

        try {
            await this.createQueryBuilder()
                .delete()
                .where("id = :id", {id})
                .execute();
        } catch (e) {
            //todo use winston here to log this.
            throw new Error('Something went wrong');
        }
        return residence;
    }

    async findResidence(id: number): Promise<Residence> {
        const residence = await this.findOne(id);

        if (!residence) throw new Error('Residence was not found');

        return residence;
    }

    findResidences(universityId: number): Promise<Residence[]> {
        const university = new University();
        university.id = universityId;

        return this.find({where: {university}})
    }
}