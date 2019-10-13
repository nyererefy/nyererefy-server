import {Authorized, Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Vote} from "./vote";
import {GraphQLUpload} from "graphql-upload";
import {GraphQLScalarType} from "graphql";
import {Subcategory} from "./subcategory";

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
    @Authorized()
    @Field(() => ID, {nullable: true})
    @Column({unique: true})
    @Generated("uuid")
    uuid: string;

    /**
     * Cloud storage link...
     */
    @Field({nullable: true})
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

    @ManyToOne(() => Subcategory, s => s.candidates, {onDelete: "CASCADE"})
    subcategory: Subcategory;

    @OneToMany(() => Vote, s => s.candidate, {onDelete: "RESTRICT"})
    votes: Vote[];
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
    @Field(() => ID)
    bio: string;
}

@InputType()
export class CandidateAvatarInput {
    @Field(() => GraphQLUpload)
    avatar: GraphQLScalarType;
}

