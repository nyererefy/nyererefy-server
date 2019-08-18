import {Field, ID, InputType, ObjectType, registerEnumType} from "type-graphql";
import {
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
import {IsAlphanumeric, IsEmail} from "class-validator";
import {Review} from "./review";

registerEnumType(State, {name: 'State'});

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({nullable: true})
    @Column({unique: true, nullable: true})
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
    @Column()
    token: string;

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
     * OneToMany
     */
    @OneToMany(() => Candidate, s => s.user)
    candidates: Candidate[];

    @OneToMany(() => Vote, s => s.user)
    votes: Vote[];

    @OneToMany(() => Review, s => s.category)
    reviews: Review[];
}

/**
 * This is sent directly from bridge.
 */
@InputType()
export class RegistrationInput implements Partial<User> {
    //Todo strip all other characters on bridge.
    @IsAlphanumeric({message: '$value contains illegal characters, Only a-zA-Z0-9 are allowed'})
    @Field()
    regNo: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    year: Year;

    @Field()
    classId: number;
}

