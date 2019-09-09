import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {SchoolRepository} from "../school/schoolRepository";
import {Class} from "../../entities/class";
import {Program} from "../../entities/program";
import {Year} from "../../utils/enums";
import {School} from "../../entities/school";
import {UniversityRepository} from "../university/universityRepository";
import moment from "moment";

interface SaveClassInterface {
    abbreviation: string
    schoolId: number;
    year: Year;
    program: Program;
    startedAt: Date
    endedAt: Date
}

@EntityRepository(Class)
export class ClassRepository extends Repository<Class> {
    private schoolRepository: SchoolRepository;
    private universityRepository: UniversityRepository;

    constructor() {
        super();
        this.schoolRepository = getCustomRepository(SchoolRepository);
        this.universityRepository = getCustomRepository(UniversityRepository);
    }

    async generateClasses(universityId: number, schoolId: number): Promise<Class[]> {
        const university = await this.universityRepository.findUniversity(universityId);
        let startMonth: number = university.semesterStartsIn;
        let endMonth: number = university.semesterEndsIn;

        const school = await this.schoolRepository.findSchoolAndPrograms(schoolId);
        let classes: Class[] = [];

        for (let i = 0; i < school.schoolPrograms.length; i++) {
            const program = school.schoolPrograms[i].program;
            const duration = program.duration;

            //Generate classes for all of them.
            for (let j = 0; j < program.duration; j++) {
                let klass = new Class();
                const year = j + 1; //so we won't have zero year

                const yearsLeft = duration - year;
                const thisYear = new Date().getFullYear();

                let startedAt = moment(`${startMonth}/01/${thisYear}`, 'MM/DD/YYYY').subtract(year, "year");
                let endedAt = moment(`${endMonth}/30/${thisYear}`, 'MM/DD/YYYY').add(yearsLeft, "year");

                klass = await this.saveClass({
                    abbreviation: program.abbreviation,
                    year,
                    schoolId,
                    program,
                    startedAt: startedAt.toDate(),
                    endedAt: endedAt.toDate()
                });
                classes.push(klass);
            }
        }

        return classes;
    }

    private async saveClass({schoolId, program, year, abbreviation, startedAt, endedAt}: SaveClassInterface) {
        const school = new School();
        school.id = schoolId;

        let klass = await this.findOne({where: {program, school, year}});

        if (klass) {
            //updating abbreviation
            klass = this.merge(klass, {abbreviation});
            return await this.save(klass);
        }

        klass = this.create({school, program, year, abbreviation, startedAt, endedAt});
        return await this.save(klass);
    }

    async findUniversityClasses(universityId: number): Promise<Class[]> {
        return await this
            .createQueryBuilder('class')
            .innerJoin('class.school', 'school')
            .innerJoin('school.branch', 'branch')
            .where("branch.universityId = :universityId", {universityId})
            .getMany();
    }
}