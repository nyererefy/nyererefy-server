import {Field, ID, registerEnumType} from "type-graphql";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Duration} from "../utils/enums";
import {School} from "./school";

registerEnumType(Duration, {name: 'Duration'});

/**
 * This stores programs which are reusable to all universities.
 * Eg Bachelor of Pharmacy 4 years program.
 * Eg Bachelor of Laboratory 3 years program.
 * Universities and Colleges should start here.
 * Todo this should be the first step when registering a university and then we should generate schools automatically.
 */
@Entity('programs')
export class Program {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    //Unique because we register program only once.
    @Field()
    @Column({unique: true})
    title: string;

    @Field(() => Duration)
    @Column({type: "enum", enum: Duration})
    duration: Duration;

    @Field()
    @Column({unique: true})
    abbreviation: string;

    /**
     * OneToMany
     */
    @OneToMany(() => School, s => s.program)
    schools: School[];
}