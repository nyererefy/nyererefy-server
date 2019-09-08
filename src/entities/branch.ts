import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {University} from "./university";
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {School} from "./school";
import {Length} from "class-validator";

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

@InputType()
export class BranchInput implements Partial<Branch> {
    @Field()
    @Length(5, 100)
    title: string;

    @Field()
    @Length(2, 10)
    abbreviation: string;
}