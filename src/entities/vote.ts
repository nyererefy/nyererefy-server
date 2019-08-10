import {Field, ID, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Candidate} from "./candidate";
import {Category} from "./category";

@ObjectType()
@Entity('votes')
export class Vote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    device: string;

    @Field()
    @Column()
    ip: string;

    /**
     * Combination of studentId-categoryId so that the same key won't be recorded twice.
     * We use this to check if user has voted. This has index you know.
     */
    @Column({type: "varchar", unique: true})
    guard: string;

    /**
     * If strict mode is one we keep track of ips per address.
     */
    @Column({type: "varchar", nullable: true, unique: true})
    ip_guard: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    /**
     * ManyToOne
     */
    @ManyToOne(() => Student, s => s.votes)
    student: Student;

    @ManyToOne(() => Candidate, s => s.votes)
    candidate: Candidate;

    @ManyToOne(() => Category, s => s.votes)
    category: Category;
}

