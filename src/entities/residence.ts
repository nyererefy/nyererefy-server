import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {User} from "./user";
import {University} from "./university";

/**
 * todo Can be changed but not during election. Some people may use this feature to misuse the system
 */
@ObjectType()
@Entity('residences')
export class Residence {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    /**
     * OneToMany
     */
    @OneToMany(() => User, user => user.residence)
    users: User[];

    @ManyToOne(() => University, u => u.residences)
    university: University;
}