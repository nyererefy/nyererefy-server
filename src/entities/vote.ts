import {ArgsType, Authorized, Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Candidate} from "./candidate";
import {IsInt, IsUUID, Length} from "class-validator";
import {Subcategory} from "./subcategory";
import {PaginationArgs} from "../utils/query";
import {Role} from "../utils/enums";

@ObjectType()
@Entity('votes')
export class Vote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({nullable: true})
    @Column({nullable: true})
    device?: string;

    @Authorized(Role.ADMIN)
    @Field({nullable: true, description: 'Not public'})
    @Column({nullable: true})
    ip?: string;
    /**
     * Combination of userId-categoryId so that the same key won't be recorded twice.
     * We use this to check if user has voted. This has index you know.
     */
    @Column({type: "int", unique: true})
    guard: number;

    /**
     * If strict mode is on we keep track of ip address per category.
     */
    @Column({type: "varchar", nullable: true, unique: true})
    ip_guard?: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;
    /**
     * ManyToOne
     */
    @ManyToOne(() => User, s => s.votes, {eager: true})
    user: User;

    @Field(() => Candidate, {complexity: 5})
    @ManyToOne(() => Candidate, s => s.votes, {eager: true})
    candidate: Candidate;

    @ManyToOne(() => Subcategory, s => s.votes, {onDelete: "CASCADE"})
    subcategory: Subcategory;

    //todo make sure no one would find user by their username.
    @Field(() => String, {nullable: true})
    get voterUsername(): string | null {
        return `${this.user.username}` || null;
    }
}

@InputType()
export class VoteInput {
    /**
     * Only candidate id since we are going to find the rest parameters eg categoryId.
     * If someone tries to vote for candidates that have no eligibility we suspend them.
     */
    @IsUUID('4')
    @Field({description: 'UUID of a candidate'})
    uuid: string;

    @Length(6,64)
    @Field({description: 'student password'})
    password: string;
}

@ArgsType()
export class GetVotesArgs extends PaginationArgs {
    @Field(() => Int)
    @IsInt()
    subcategoryId: number;
}

