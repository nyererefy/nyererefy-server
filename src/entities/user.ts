import {Field, ID, ObjectType, registerEnumType} from "type-graphql";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Class} from "./class";
import {Candidate} from "./candidate";
import {State, Year} from "../utils/enums";
import {Vote} from "./vote";
import {IsEmail, IsUUID, Length} from "class-validator";
import {Review} from "./review";
import {University} from "./university";

registerEnumType(State, {name: 'State'});

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    regNo: string;

    /**
     * User can use only one email at a time.
     * This is not social network so we don't need too many ways of login in.
     */
    @Field()
    @Column({unique: true})
    email: string;

    @Field({nullable: true})
    @Column({unique: true, nullable: true})
    username?: string;

    /**
     * We take this name from email when use social login.
     */
    @Field({nullable: true})
    @Column({nullable: true})
    name?: string;

    /**
     * Email token
     */
    @Column({nullable: true})
    token?: string;

    /**
     * Despite from bridge-registration but is this user verified
     * This is useful when we verify them all. We can trust everyone who brings members.
     * - Once verified can not be deleted with api calls.
     */
    @Field()
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
    joinedAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Last seen should be updated when user logs in.
     * This is used to delete account after some time.
     */
    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    lastSeenAt?: string;

    /**
     * State of account
     */
    @Field(() => State)
    @Column({type: "enum", enum: State, default: State.ACTIVE})
    state: State;

    /**
     * ManyToOne
     */
    @ManyToOne(() => Class, c => c.users)
    class: Class;

    /**
     * Some may not have classes registered.
     */
    @ManyToOne(() => University)
    university: University;

    /**
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.user)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.user)
    votes: Vote[];

    @OneToMany(() => Review, s => s.category)
    reviews: Review[];

    @BeforeInsert()
    cleanData() {
        this.regNo = this.regNo.toUpperCase();
        this.email = this.email.toLowerCase();
    }
}

/**
 * This one just registers user with their specific university that's all.
 * Everything will be the same for all.
 */
export class RegistrationInput implements Partial<User> {
    @Length(1, 50)
    regNo: string;

    @Field()
    @IsEmail()
    email: string;

    /**
     * We get it from university's uuid
     */
    @Field()
    @IsUUID('4')
    uuid: string;
}

/**
 * This one checks reg no patterns to match with what student is studying.
 * We can find who is student from registration number.
 * number should be split  by dashes like uuid.
 */
export class IntelligentRegistrationInput extends RegistrationInput {
}

/**
 * This is should contain year and program abbreviation.
 */
export class RegistrationByProgramInput extends RegistrationInput {
    year: Year;

    @Length(1, 50)
    programAbbreviation: string;
}

/**
 * Like I am Sylvanus taking bachelor in Pharmacy should bring BPHARM
 */
export class RegistrationBySchoolInput extends RegistrationInput {
    year: Year;

    @Length(1, 50)
    schoolIdentifier: string;
}



