import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {University} from "./university";
import {Field, ID, ObjectType} from "type-graphql";
import {School} from "./school";

/**
 * For Colleges/University with only one branch it will be generated automatically.
 */
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
    @OneToMany(() => School, s => s.branch)
    schools: School[];

    /**
     * ManyToOne
     */
    @ManyToOne(() => University, u => u.branches)
    university: University;
}