import {EntityRepository, getCustomRepository, Repository} from "typeorm";
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
    private universityRepository: UniversityRepository;

    constructor() {
        super();
        this.universityRepository = getCustomRepository(UniversityRepository);
    }

    async generateClasses(universityId: number): Promise<Class[]> {
        const university = await this.universityRepository.findUniversityAndSchoolAndPrograms(universityId);
        let startMonth: number = university.semesterStartsIn;
        let endMonth: number = university.semesterEndsIn;
        let classes: Class[] = [];

        const branches = university.branches;

        for (let b = 0; b < branches.length; b++) {
            const branch = branches[b];
            const schools = branch.schools;

            for (let s = 0; s < schools.length; s++) {
                const school = schools[s];

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
                            schoolId: school.id,
                            program,
                            startedAt: startedAt.toDate(),
                            endedAt: endedAt.toDate()
                        });
                        classes.push(klass);
                    }
                }
            }
        }
        return classes;
    }

    async findUniversityClasses(universityId: number): Promise<Class[]> {
        return await this
            .createQueryBuilder('class')
            .innerJoin('class.school', 'school')
            .innerJoin('school.branch', 'branch')
            .where("branch.universityId = :universityId", {universityId})
            .getMany();
    }

    async findClass(schoolId: number, year: Year, programId: number): Promise<Class> {
        const school = new School();
        school.id = schoolId;

        const program = new Program();
        program.id = programId;

        const klass = await this.findOne({where: {school, year, program}});
        if (klass) {
            return klass;
        }

        throw new Error('Class not found')

    }

    private async saveClass({schoolId, program, year, abbreviation, startedAt, endedAt}: SaveClassInterface) {
        const school = new School();
        school.id = schoolId;

        let klass = await this.findOne({where: {program, school, year}});

        if (klass) {
            //updating abbreviation
            klass = this.merge(klass, {abbreviation});
            await this.update(klass.id, klass);
            return klass;
        }

        klass = this.create({school, program, year, abbreviation, startedAt, endedAt});
        return await this.save(klass);
    }
}