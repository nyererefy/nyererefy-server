import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Election} from "./election";
import {IsEmail, IsUrl, Length} from "class-validator";
import {Branch} from "./branch";
import {Residence} from "./residence";
import {ColumnEncryptionTransformer} from "../utils/ColumnEncryptionTransformer";

@ObjectType()
@Entity('universities')
export class University {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => ID)
    @Generated('uuid')
    @Column({unique: true})
    uuid: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column({unique: true})
    abbreviation: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    webUrl: string;

    @Field()
    @Column()
    bridgeUrl: string;

    @Field()
    @Column({transformer: new ColumnEncryptionTransformer('1234567890123456')}) //todo use keys.
    secret: string;

    @Field({description: 'Month new semester starts'})
    @Column("tinyint")
    semesterStartsIn: number;

    @Field({description: 'Month new semester ends'})
    @Column("tinyint")
    semesterEndsIn: number;

    /**
     * OneToMany
     */
    @OneToMany(() => Branch, s => s.university, {cascade: ['insert']})
    branches: Branch[];

    @OneToMany(() => Election, s => s.university)
    elections: Election[];

    @OneToMany(() => Residence, s => s.university)
    residences: Residence[];
}

@InputType()
export class UniversityInput implements Partial<University> {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @Length(5, 100)
    title: string;

    @Field()
    @Length(2, 10)
    abbreviation: string;

    @Field()
    @IsUrl()
    @Length(5, 100)
    webUrl: string;

    @Field()
    @IsUrl()
    @Length(5, 100)
    bridgeUrl: string;

    @Field({description: 'Month new semester starts'})
    @Column()
    semesterStartsIn: number;

    @Field({description: 'Month new semester ends'})
    @Column()
    semesterEndsIn: number;
}

@InputType()
export class UniversityEditInput extends UniversityInput {
}

