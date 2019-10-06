import {Field, ID, InputType, ObjectType, registerEnumType} from "type-graphql";
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
import {Sex, State, Year} from "../utils/enums";
import {Vote} from "./vote";
import {IsEmail, Length} from "class-validator";
import {Review} from "./review";
import {Residence} from "./residence";

registerEnumType(State, {name: 'State'});
registerEnumType(Sex, {name: 'Sex'});

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
    @Field() //todo hide email and show it to its owner only.
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
        this.regNo = this.regNo.toUpperCase();
        this.email = this.email.toLowerCase();
    }
}

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
@InputType()
export class RegistrationByProgramInput extends RegistrationInput {
    year: Year;

    @Length(1, 50)
    programIdentifier: string;
}



