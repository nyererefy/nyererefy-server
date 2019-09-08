import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {SchoolRepository} from "../school/schoolRepository";
import {Class} from "../../entities/class";
import {Program} from "../../entities/program";
import {Year} from "../../utils/enums";
import {School} from "../../entities/school";

interface SaveClassInterface {
    abbreviation: string
    schoolId: number;
    year: Year;
    program: Program;
}

@EntityRepository(Class)
export class ClassRepository extends Repository<Class> {
    private schoolRepository: SchoolRepository;

    constructor() {
        super();
        this.schoolRepository = getCustomRepository(SchoolRepository);
    }

    async generateClasses(schoolId: number): Promise<Class[]> {
        const school = await this.schoolRepository.findSchoolAndPrograms(schoolId);
        let classes: Class[] = [];

        for (let i = 0; i < school.schoolPrograms.length; i++) {
            const program = school.schoolPrograms[i].program;

            //Generate classes for all of them.
            for (let j = 0; j < program.duration; j++) {
                let klass = new Class();

                klass = await this.saveClass({
                    abbreviation: program.abbreviation,
                    year: j + 1, //so we won't have zero year
                    schoolId,
                    program
                });
                classes.push(klass);
            }
        }

        return classes;
    }

    /**
     * Todo we should check if similar class already exists, if true update it. deleting it is dangerous.
     * @param schoolId
     * @param program
     * @param year
     * @param abbreviation
     */
    private async saveClass({schoolId, program, year, abbreviation}: SaveClassInterface) {
        const school = new School();
        school.id = schoolId;

        const klass = this.create({school, program, year, abbreviation});
        return await this.save(klass);
    }
}