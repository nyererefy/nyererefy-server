import {ArgsType, Authorized, Field, ID, InputType, ObjectType, registerEnumType} from "type-graphql";
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
import {IsEmail, IsString, Length} from "class-validator";
import {Review} from "./review";
import {Residence} from "./residence";
import {PaginationArgs} from "../utils/query";
import {CURRENT_USER} from "../utils/consts";

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

    //Only logged in users can see.
    @Authorized() //todo SAME_UNIVERSITY
    @Field()
    @Column({unique: true})
    regNo: string;

    /**
     * User can use only one email at a time.
     * This is not social network so we don't need too many ways of login in.
     */
    @Authorized(CURRENT_USER)
    @Field()
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
    isDataCorrect: boolean;

    /**
     * If true we won't take google data any longer.
     */
    @Field()
    @Column({default: false})
    isProfileSet: boolean;

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
    sex: State;

    /**
     * ManyToOne
     * Eager just for showing class snippet Sylvanus Kateile BPHARM 4.
     */
    @Field(() => Class)
    @ManyToOne(() => Class, c => c.users, {eager: true})
    class: Class;

    @ManyToOne(() => Residence, c => c.users)
    residence: Residence;

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


