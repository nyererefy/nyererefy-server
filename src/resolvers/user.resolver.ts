import {Query, Resolver} from "type-graphql";
import {Student} from "../entities/student";
import {getCustomRepository} from "typeorm";
import {StudentRepository} from "../repositories/student/studentRepository";

const studentRepository = getCustomRepository(StudentRepository);

@Resolver()
export class UserResolver {
    @Query(() => Student)
    async user(): Promise<Student> {
        return await studentRepository.getStudent(1) as Student;
    }
}