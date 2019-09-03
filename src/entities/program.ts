import {Field, ID, ObjectType, registerEnumType} from "type-graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Duration} from "../utils/enums";
import {School} from "./school";
import {Class} from "./class";

registerEnumType(Duration, {name: 'Duration'});

/**
 * This stores programs which are reusable to all universities.
 * Eg Bachelor of Pharmacy 4 years programs.
 * Eg Bachelor of Laboratory 3 years programs.
 * Universities and Colleges should start here.
 * Todo this should be the first step when registering a university and then we should generate schools automatically.
 * Todo We are the one who register programs.
 */
@ObjectType()
@Entity('programs')
export class Program {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    //Unique because we register programs only once.
    @Field()
    @Column({unique: true})
    title: string;

    @Field()
    @Column({unique: true})
    abbreviation: string;

    @Field(() => Duration)
    @Column({type: "enum", enum: Duration})
    duration: Duration;

    /* ManyToOne */

    @ManyToOne(() => School, s => s.programs)
    school: School;

    /* OneToMany */

    /**
     * This is helpful to know how many classes have similar programs.
     * Like in kichuo
     */
    @OneToMany(() => Class, s => s.program)
    classes: Class[];
}