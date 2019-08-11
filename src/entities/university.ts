import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Class} from "./class";
import {School} from "./school";
import {Election} from "./election";
import {IsEmail, IsUrl, Length} from "class-validator";

@ObjectType()
@Entity('universities')
export class University {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => ID)
    @Generated('uuid')
    @Column({unique: true})
    identifier: number;

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
    web_url: string;

    @Field()
    @Column()
    bridge_url: string;

    @Field()
    @Column({nullable: true})
    secret?: string;

    /**
     * OneToMany
     */
    @OneToMany(() => Student, s => s.university)
    students: Student[];

    @OneToMany(() => Class, s => s.university)
    classes: Class[];

    @OneToMany(() => Class, s => s.university)
    branches: Class[];

    @OneToMany(() => School, s => s.university)
    schools: School[];

    @OneToMany(() => Election, s => s.university)
    elections: Election[];
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
    @IsUrl()
    @Length(5, 100)
    web_url: string;

    @Field()
    @IsUrl()
    @Length(5, 100)
    bridge_url: string;
}

@InputType()
export class UniversityEditInput extends UniversityInput {
}

