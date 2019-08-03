import {EntityRepository, Repository} from "typeorm";
import {Student} from "../entities/student";

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    getStudent(id: number) {
        return this.findOne(id);
    }
}