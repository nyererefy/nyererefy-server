import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Candidate} from "./candidate";
import {Category} from "./category";
import {IsUUID} from "class-validator";

@ObjectType()
@Entity('votes')
export class Vote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    device: string;

    @Field()
    @Column()
    ip: string;

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
    ip_guard: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    /**
     * ManyToOne
     */
    @ManyToOne(() => User, s => s.votes)
    user: User;

    @ManyToOne(() => Candidate, s => s.votes)
    candidate: Candidate;

    @ManyToOne(() => Category, s => s.votes)
    category: Category;
}

@InputType()
export class VoteInput {
    @Field()
    device: string;

    /**
     * Only candidate id since we are going to find the rest parameters eg categoryId.
     * If someone tries to vote for candidates that have no eligibility we suspend them.
     */
    @IsUUID('4')
    @Field({description: 'UUID of a candidate'})
    uuid: string;
}

