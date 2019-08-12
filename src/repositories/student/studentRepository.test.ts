import '../../utils/test/initTestDb'
import {StudentRepository} from "./studentRepository";
import {getCustomRepository} from "typeorm";
import faker from "faker";
import {RegistrationInput} from "../../entities/student";

let repository: StudentRepository;

beforeEach(async () => {
    repository = getCustomRepository(StudentRepository);
});

describe('Student', () => {
    it('should create a new student', async () => {
        const input: RegistrationInput = {
            email: faker.internet.email(),
            regNo: faker.company.companyName(),
            classId: 1,
            year: 1
        };
        const result = await repository.registerStudent(input);

        expect(result).toMatchObject({
            email: input.email,
            regNo: input.regNo
        })
    });

    it('should find student', async () => {
        const id = 1;
        const result = await repository.findStudent(id);
        expect(result).toBeDefined();
    });

    it('should find students', async () => {
        const results = await repository.findStudents();

        expect(results).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String)
            })
        )
    });
});