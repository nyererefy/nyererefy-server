import {generatePdf} from "./pdfGenerarator";
import '../utils/test/initTestDb'
import {TEST_ELECTION_ID} from "../utils/consts";
import {createCandidate} from "../utils/test/initDummyData";

describe('Pdf', () => {
    it('generated pdf', async function () {
        await createCandidate(2, 1);
        await createCandidate(3, 1);

        const link = await generatePdf(TEST_ELECTION_ID);
        expect(link).toBeDefined();
    });
});