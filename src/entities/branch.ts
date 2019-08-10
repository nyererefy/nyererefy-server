import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Class} from "./class";
import {University} from "./university";
import {Field, ID, ObjectType} from "type-graphql";
import {School} from "./school";

@ObjectType()
@Entity('branches')
export class Branch {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    /**
     * OneToMany
     */
    @OneToMany(() => Student, s => s.branch)
    students: Student[];

    @OneToMany(() => Class, c => c.branch)
    classes: Class[];

    @OneToMany(() => School, s => s.branch)
    schools: School[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => University, u => u.branches)
    university: University;
}