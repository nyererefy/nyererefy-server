import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm";

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
    email:string;

    @Field()
    @Column()
    web_url:string;

    @Field()
    @Column()
    bridge_url:string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    secret: string
}

