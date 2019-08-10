import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./student";
import {Class} from "./class";
import {School} from "./school";

@ObjectType()
@Entity('universities')
export class University {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => ID)
    @Generated('uuid')
    @Column({unique: true})
    identifier: number;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    web_url: string;

    @Field()
    @Column()
    bridge_url: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    secret: string;

    /**
     * OneToMany
     */
    @OneToMany(() => Student, s => s.university)
    students: Student[];

    @OneToMany(() => Class, s => s.university)
    classes: Class[];

    @OneToMany(() => Class, s => s.university)
    branches: Class[];

    @OneToMany(() => School, s => s.university)
    schools: School[];
}

