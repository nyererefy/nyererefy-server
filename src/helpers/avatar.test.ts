import {uploadImageFromUrl} from "./avatar";
import faker from 'faker'

describe('Avatar', () => {
    it('should upload avatar from url', async function () {
        const img = await uploadImageFromUrl(faker.internet.avatar());
        expect(img).toBeDefined()
    });
});