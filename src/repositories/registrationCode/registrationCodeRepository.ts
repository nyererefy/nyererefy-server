import {DeleteResult, EntityRepository, Repository} from "typeorm";
import {RegistrationCode} from "../../entities/registrationCode";
import cryptoRandomString from "crypto-random-string";

@EntityRepository(RegistrationCode)
export class RegistrationCodeRepository extends Repository<RegistrationCode> {
    generateRegistrationCode() {
        const code = new RegistrationCode();
        code.code = cryptoRandomString({length: 32, characters: 'abcdefghijklmnopqrstvwxyz0123456789'});

        return this.save(code);
    }

    async findRegistrationCode(code: string): Promise<RegistrationCode> {
        let registrationCode = await this.findOne({code});
        if (!registrationCode) throw new Error('Invalid code');
        return registrationCode;
    }

    deleteRegistrationCode(id: number): Promise<DeleteResult> {
        return this.delete(id);
    }
}