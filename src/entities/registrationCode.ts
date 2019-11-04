import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";


@ObjectType({
        description: 'used to prevent spam when registering college/university system admins.' +
            'This is sent to their email after they have contacted us.'
    }
)
@Entity('registration_codes')
export class RegistrationCode {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true, length: 50})
    code: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
}