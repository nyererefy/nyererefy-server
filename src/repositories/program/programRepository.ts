import {EntityRepository, Repository} from "typeorm";
import {Program, ProgramInput} from "../../entities/program";

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {
    createProgram(input: ProgramInput) {
        const program = this.create(input);

        return this.save(program);
    }

    async editProgram(id: number, input: ProgramInput) {
        let program = await this.findOne(id);
        if (!program) throw new Error('Program was not found');

        program = this.merge(program, input);

        return this.save(program);
    }

    async findProgram(id: number): Promise<Program> {
        let program = await this.findOne(id);
        if (!program) throw new Error('Program was not found');
        return program;
    }

    findPrograms() {
        return this.find()
    }
}