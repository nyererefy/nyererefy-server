import {EntityRepository, Repository} from "typeorm";
import {RegistrationInput, Student} from "../../entities/student";

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
    registerStudent(input: RegistrationInput) {
        const student = this.create(input);
        return this.save(student);
    }

    editStudent(input: RegistrationInput) {
        const student = this.create(input);
        return this.save(student);
    }

    findStudent(id: number) {
        return this.findOne(id);
    }

    findStudents() {
        return this.find();
    }
}