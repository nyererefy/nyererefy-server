import {Field, ID, InputType, ObjectType} from "type-graphql";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {State, Strategy} from "../utils/enums";
import {IsEmail, Length} from "class-validator";
import {University} from "./university";

//todo make sure he can't create another university
@ObjectType()
@Entity('managers')
export class Manager {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({unique: true})
    email: string;

    @Column({type: "text", nullable: true})
    token?: string;

    @Field({nullable: true})
    @Column({nullable: true})
    avatar?: string;

    @Field()
    @CreateDateColumn()
    joinedAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => State)
    @Column({type: "tinyint", default: State.ACTIVE})
    state: State;

    @Field(() => University, {nullable: true})
    @JoinColumn()
    @OneToOne(() => University, u => u.manager, {nullable: true, eager: true})
    university?: University;

    @BeforeInsert()
    cleanData() {
        this.email = this.email.toLowerCase().trim();
    }
}

/**
 * Sign up form will have one input for code and signup with google below. if code is good then we register this guy.
 */
@InputType()
export class ManagerSignUpInput implements Partial<Manager> {
    @Field()
    @Length(1, 50)
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @Length(32, 32)
    code: string;
}

@InputType()
export class ManagerSocialSignUpInput implements Partial<Manager> {
    @Field(() => String)
    @Length(30)
    token: string;

    @Field(() => Strategy, {defaultValue: Strategy.GOOGLE})
    strategy: Strategy;

    @Field(() => String)
    @Length(32, 32)
    code: string;
}

@InputType({description: 'Magic link will be sent to inbox'})
export class ManagerLoginInput implements Partial<Manager> {
    @Field()
    @IsEmail()
    email: string;
}