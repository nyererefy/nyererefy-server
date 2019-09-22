import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Candidate} from "./candidate";
import {IsUUID} from "class-validator";
import {Subcategory} from "./subcategory";

@ObjectType()
@Entity('votes')
export class Vote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({nullable: true})
    @Column({nullable: true})
    device?: string;

    //todo this should not be shown to all people. either trim some number and show full only to the owner.
    @Field({nullable: true})
    @Column({nullable: true})
    ip?: string;

    //todo make sure no one would find user by their username.
    @Field(() => String, {nullable: true})
    get voterUsername(): string | null {
        return `${this.user.username}` || null;
    }

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
}

