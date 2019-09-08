import '../../utils/test/initTestDb'
import {createProgram, registerProgram} from "../../utils/test/initDummyData";

describe('Program', () => {
    it('should register a new program to a university', async () => {
        const program = await createProgram();

        const result = await registerProgram(1, program.id);

        expect(result).toMatchObject({
            id: expect.any(Number)
        });
    });
});