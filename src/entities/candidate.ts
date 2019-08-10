import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Category} from "./category";
import {Vote} from "./vote";

@ObjectType()
@Entity('candidates')
export class Candidate {
    /**
     * Not meant to be human readable...
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    readonly id: string;

    /**
     * Cloud storage link...
     */
    @Field({nullable: true})
    @Column({nullable: true})
    image?: string;

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

    @OneToMany(() => Vote, s => s.candidate)
    votes: Vote[];
}

