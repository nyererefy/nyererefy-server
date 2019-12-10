import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Vote} from "./vote";
import {GraphQLUpload} from "graphql-upload";
import {GraphQLScalarType} from "graphql";
import {Subcategory} from "./subcategory";
import {getImageUrl} from "../helpers/avatar";

/**
 * You can't contest on more than one category per election
 */
@ObjectType()
@Entity('candidates')
export class Candidate {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Not meant to be human readable...
     */
        // @Authorized() //todo
    @Field(() => ID, {nullable: true})
    @Column({unique: true})
    @Generated("uuid")
    uuid: string;

    /**
     * Cloud storage link...
     */
    @Field(() => String, {nullable: true, name: 'avatar'})
    get resolveAvatar(): string | null {
        return `${getImageUrl(this.avatar)}` || null;
    }

    @Column({nullable: true})
    avatar?: string;

    @Field({nullable: true})
    @Column({nullable: true})
    bio?: string;

    /**
     * ManyToOne
     */
    @Field(() => User)
    @ManyToOne(() => User, s => s.candidates, {eager: true})
    user: User;

    @ManyToOne(() => Subcategory, s => s.candidates)
    subcategory: Subcategory;

    @OneToMany(() => Vote, s => s.candidate, {onDelete: "RESTRICT"})
    votes: Vote[];

    @Field(() => Int, {description: 'Not to be used in every query'})
    votesCount: number;

    // todo add winner field that when election ends winner is declared automatically and notify every body.
    @Field({nullable: true})
    @Column({nullable: true})
    isWinner?: boolean;
}

@InputType()
export class CandidateInput {
    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    subcategoryId: number;
}

@InputType()
export class CandidateEditInput implements Partial<Candidate> {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    bio: string;
}

@InputType()
export class CandidateAvatarInput {
    @Field(() => Int)
    id: number;

    @Field(() => GraphQLUpload)
    avatar: GraphQLScalarType;
}

