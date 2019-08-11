import {Field, InputType, ObjectType, registerEnumType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Class} from "./class";
import {University} from "./university";
import {Branch} from "./branch";
import {School} from "./school";
import {Candidate} from "./candidate";
import {States, Year} from "../utils/enums";
import {Vote} from "./vote";
import {IsEmail} from "class-validator";

registerEnumType(States, {name: 'States'});

@ObjectType()
@Entity('students')
export class Student {
    @Field()
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column({unique: true})
    reg_no: string;

    /**
     * User can use only one email at a time.
     * This is not social network so we don't need too many ways of login in.
     */
    @Field()
    @Column({unique: true})
    email: string;

    @Field()
    @Column({unique: true, nullable: true})
    username?: string;

    /**
     * We take this name from email when use social login.
     */
    @Field()
    @Column({nullable: true})
    name?: string;

    /**
     * Email token
     */
    @Field()
    token: string;

    /**
     * Despite from bridge-registration but is this user verified
     * This is useful when we verify them all. We can trust everyone who brings members.
     * - Once verified can not be deleted with api calls.
     */
    @Column()
    isVerified: boolean;

    /**
     * Google picture url. Can be updated manually.
     */
    @Field({nullable: true})
    @Column({nullable: true})
    avatar?: string;

    @Field()
    @CreateDateColumn()
    joinedAt: string;

    /**
     * Last seen should be updated when user logs in.
     * This is used to delete account after some time.
     */
    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    lastSeenAt?: string;

    /**
     * States of account
     */
    @Field()
    @Column({type: "enum", enum: States, default: States.ACTIVE})
    eligible: States;

    /**
     * ManyToOne
     */
    @ManyToOne(() => University, u => u.students)
    university: University;

    @ManyToOne(() => Branch, b => b.students)
    branch: Branch;

    @ManyToOne(() => School, f => f.students)
    school: School;

    @ManyToOne(() => Class, c => c.students)
    class: Class;

    /**
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.student)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.student)
    votes: Vote[];
}

/**
 * This is sent directly from bridge.
 */
@InputType()
export class RegistrationInput implements Partial<Student> {
    @Field()
    reg_no: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    year: Year;

    @Field()
    classId: number;
}

