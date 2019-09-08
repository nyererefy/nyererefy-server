import {Field, ID, InputType, ObjectType} from "type-graphql";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Category} from "./category";
import {University} from "./university";
import {IsAlpha} from "class-validator";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

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

    /**
     * This will only work for programs/sex/all
     */
    @Field({
        defaultValue: false,
        description: 'This will make this category be eligible to all who share the eligibility regardless of university'
    })
    @Column({default: false})
    isExtended: boolean;

    /**
     * Eg MD student running for BPHARM position.
     */
    @Field({
        defaultValue: false,
        description: 'Allows candidates to be placed in category with no shared characters. It\'s rarely true '
    })
    @Column({default: false})
    isAbnormal: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field({nullable: true})
    @UpdateDateColumn()
    updatedAt?: Date;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    startAt?: Date;

    @Field({nullable: true})
    @Column('datetime', {nullable: true})
    endAt?: Date;

    /**
     * OneToMany
     */
    @OneToMany(() => Category, c => c.election)
    categories: Category[];

    /**
     * ManyToOne
     */

    /**
     * nullable: true because we can create election which are not un-based.
     */
    @ManyToOne(() => University, u => u.elections, {nullable: true})
    university?: University
}

@InputType()
export class ElectionInput implements Partial<Election> {
    @IsAlpha()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;
}

@InputType()
export class ElectionEditInput implements Partial<Election> {
    @IsAlpha()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;
}
