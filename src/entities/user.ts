import {ArgsType, Authorized, Field, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Class} from "./class";
import {Candidate} from "./candidate";
import {Role, Sex, State, Strategy, Year} from "../utils/enums";
import {Vote} from "./vote";
import {IsAlphanumeric, IsEmail, IsInt, IsString, Length} from "class-validator";
import {Review} from "./review";
import {Residence} from "./residence";
import {PaginationArgs} from "../utils/query";
import {CURRENT_USER} from "../utils/consts";
import {GraphQLUpload} from "graphql-upload";
import {GraphQLScalarType} from "graphql";

registerEnumType(State, {name: 'State'});
registerEnumType(Sex, {name: 'Sex'});
registerEnumType(Role, {name: 'Role'});
registerEnumType(Strategy, {name: 'Strategy'});

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    //Only same class can see.
    // @Authorized(SAME_CLASS)
    @Field({nullable: true})
    @Column({unique: true})
    regNo: string;

    /**
     * User can use only one email at a time.
     * This is not social network so we don't need too many ways of login in.
     */
    @Authorized(CURRENT_USER)
    @Field({nullable: true})
    @Column({unique: true})
    email: string;

    @Field({nullable: true})
    @Column({unique: true, nullable: true})
    username?: string;

    /**
     * We take this name from email when use social login.
     */
    @Index()
    @Field({nullable: true})
    @Column({nullable: true})
    name?: string;

    /**
     * Email token
     */
    @Column({nullable: true, type: "text"})
    token?: string;

    /**
     * Email token
     */
    @Column({nullable: true})
    password?: string;

    /**
     * Despite from bridge-registration but is this user verified
     * This is useful when we verify them all. We can trust everyone who brings members.
     * - Once verified can not be deleted with api calls.
     */
    @Field()
    @Column()
    isVerified: boolean;

    /**
     * If data is correct then student data won't be updated from bridge calls.
     * We should check this before user starts using our app.
     */
    @Field()
    @Column()
    isDataConfirmed: boolean;

    /**
     * If true we won't take google data any longer.
     */
    @Field()
    @Column({default: false})
    isAccountSet: boolean;

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
    @Column({type: "tinyint", default: State.ACTIVE})
    state: State;

    /**
     * State of account
     */
    @Field(() => Sex, {nullable: true})
    @Column({type: "tinyint", nullable: true})
    sex: Sex;

    /**
     * ManyToOne
     * Eager just for showing class snippet Sylvanus Kateile BPHARM 4.
     */
        // @Authorized([CURRENT_USER, SAME_CLASS, CURRENT_UNIVERSITY_MANAGER])
    @Field(() => Class, {nullable: true})
    @ManyToOne(() => Class, c => c.users, {eager: true})
    class: Class;

    @ManyToOne(() => Residence, c => c.users, {nullable: true})
    residence?: Residence;

    /**
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.user)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.user)
    votes: Vote[];

    @OneToMany(() => Review, s => s.user)
    reviews: Review[];

    @BeforeInsert()
    cleanData() {
        this.email = this.email.toLowerCase().trim();
    }
}

//todo these dont validate inputs.

/**
 * This one checks reg no patterns to match with what student is studying.
 * We can find who is student from registration number.
 * number should be split  by dashes like uuid.
 */
export class RegistrationInput implements Partial<User> {
    @Length(1, 50)
    regNo: string;

    @IsEmail()
    email: string;
}

/**
 * This is should contain year and program abbreviation.
 * Like I am Sylvanus taking bachelor in Pharmacy should bring BPHARM
 */
export class RegistrationByProgramInput extends RegistrationInput {
    year: Year;

    @Length(1, 50)
    programIdentifier: string;
}

export interface RegistrationByProgramInputInterface {
    regNo: string;
    email: string;
    year: Year;
    programIdentifier: string;
}

@ArgsType()
export class GetUsersArgs extends PaginationArgs {
    @Field({nullable: true, description: 'for searching'})
    @IsString()
    query?: string;
}

@InputType()
export class LoginInput {
    @Field(() => String)
    @Length(30)
    token: string;

    @Field(() => Strategy)
    strategy: Strategy;

    @Field(() => Role, {nullable: true, defaultValue: Role.STUDENT})
    role: Role;
}

@InputType()
export class UserSetupInput implements Partial<User> {
    @Field()
    @IsAlphanumeric()
    @Length(1, 20)
    username: string;

    @Field()
    @IsString()
    @Length(1, 20)
    name: string;

    @Field()
    @Length(6, 64)
    password: string;

    @Field(() => Sex)
    sex: Sex;
}

@InputType()
export class UserResidenceInput {
    @Field(() => Int)
    @IsInt()
    residenceId: number;
}

@InputType()
export class UserAvatarInput {
    @Field(() => GraphQLUpload)
    avatar: GraphQLScalarType;
}



