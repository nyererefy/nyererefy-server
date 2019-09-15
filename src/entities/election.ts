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
import {IsAlpha, IsAlphanumeric, IsOptional} from "class-validator";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
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
     * This will only work for schoolPrograms/sex/all
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

    @ManyToOne(() => University, u => u.elections)
    university: University
}

@InputType()
export class ElectionInput implements Partial<Election> {
    @IsAlpha()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;
}

@InputType()
export class ElectionEditInput implements Partial<Election> {
    @IsAlphanumeric()
    @IsOptional()
    @Field({nullable: true, description: 'Name of election. a-zA-Z0-9 only'})
    title?: string;

    @Field({nullable: true})
    startAt?: Date;

    @Field({nullable: true})
    endAt?: Date;

    @Field({nullable: true})
    isOpen?: boolean;

    @Field({nullable: true})
    isStrict?: boolean;

    @Field({nullable: true})
    isExtended?: boolean;

    @Field({nullable: true})
    isAbnormal?: boolean;
}
