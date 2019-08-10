import {Field, ID, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./category";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    isOpen: boolean;

    /**
     * If is strict that means one vote per ip for certain category.
     */
    @Field()
    @Column()
    isStrict: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    startAt?: string;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    endAt?: string;

    /**
     * OneToMany
     */
    @OneToMany(() => Category, s => s.election)
    categories: Category[];
}

