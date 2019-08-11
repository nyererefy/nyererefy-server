import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Student} from "./student";
import {University} from "./university";
import {Branch} from "./branch";
import {School} from "./school";

/**
 * These are generated automatically..
 */
@ObjectType()
@Entity('classes')
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    /**
     * ManyToOne
     */
    @ManyToOne(() => University, u => u.classes)
    university: University;

    @ManyToOne(() => Branch, b => b.classes)
    branch: Branch;

    @ManyToOne(() => School, f => f.classes)
    school: School;

    /**
     * OneToMany
     */
    @OneToMany(() => Student, student => student.class)
    students: Student[]
}