import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Category} from "./category";
import {Vote} from "./vote";
import {GraphQLUpload} from "graphql-upload";
import {GraphQLScalarType} from "graphql";

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
    @Field(() => ID)
    @Column({unique: true})
    @Generated("uuid")
    readonly uuid: string;

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
    @ManyToOne(() => Student, s => s.candidates)
    student: Student;

    @ManyToOne(() => Category, s => s.candidates)
    category: Category;

    @OneToMany(() => Vote, s => s.candidate, {onDelete: "RESTRICT"})
    votes: Vote[];
}

@InputType()
export class CandidateInput {
    @Field(() => ID)
    studentId: number;

    @Field(() => ID)
    categoryId: number;
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

