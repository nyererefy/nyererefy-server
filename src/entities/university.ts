import {Authorized, Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Column, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Election} from "./election";
import {IsEmail, IsUrl, Length} from "class-validator";
import {Branch} from "./branch";
import {Residence} from "./residence";
import {ColumnEncryptionTransformer} from "../utils/ColumnEncryptionTransformer";
import {CURRENT_UNIVERSITY_MANAGER} from "../utils/consts";
import {Manager} from "./manager";

@ObjectType()
@Entity('universities')
export class University {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    // so that other manager won't see other university stuff.
    @Authorized(CURRENT_UNIVERSITY_MANAGER)
    @Field(() => ID, {description: 'Requires authentication', nullable: true})
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

    @Authorized(CURRENT_UNIVERSITY_MANAGER)
    @Field({nullable: true, description: 'Requires authentication'})
    @Column({transformer: new ColumnEncryptionTransformer('1234567890123456')}) //todo use keys.
    secret: string;

    @Field(() => Int, {description: 'Month new semester starts'})
    @Column("tinyint")
    semesterStartsIn: number;

    @Field(() => Int, {description: 'Month new semester ends'})
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

    @OneToOne(() => Manager, s => s.university)
    manager: Manager;
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

    @Field(() => Int, {description: 'Month new semester starts'})
    @Column()
    semesterStartsIn: number;

    @Field(() => Int, {description: 'Month new semester ends'})
    @Column()
    semesterEndsIn: number;
}

@InputType()
export class UniversityEditInput extends UniversityInput {
}

