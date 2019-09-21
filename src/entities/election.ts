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
import {IsAlphanumeric, IsDate, IsOptional} from "class-validator";

@ObjectType()
@Entity('elections')
export class Election {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({length: 100})
    title: string;

    @Field({
        defaultValue: false,
        description: 'If true it means people can vote, this is set to true automatically when specified time reaches.'
    })
    @Column({default: false})
    isOpen: boolean;

    @Field({
        defaultValue: false,
        description: 'If true it means elections is archived and no any action will be allowed further'
    })
    @Column({default: false})
    isCompleted: boolean;

    @Field({
        defaultValue: false,
        description: 'If is true that means one vote per ip for certain category.'
    })
    @Column({default: false})
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
        description: 'Allows candidates to be placed in category with no shared characters. It\'s rarely true'
    })
    @Column({default: false})
    isAbnormal: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field({nullable: true})
    @UpdateDateColumn()
    updatedAt?: Date;

    @Field()
    @Column('datetime')
    startAt: Date;

    @Field()
    @Column('datetime')
    endAt: Date;

    /**
     * OneToMany
     */
    @OneToMany(() => Category, c => c.election, {onDelete: "CASCADE"})
    categories: Category[];

    /**
     * ManyToOne
     */

    @ManyToOne(() => University, u => u.elections)
    university: University
}

@InputType()
export class ElectionInput implements Partial<Election> {
    @IsAlphanumeric()
    @Field({description: 'Name of election. a-zA-Z only'})
    title: string;

    @IsDate()
    @Field()
    startAt: Date;

    @IsDate()
    @Field()
    endAt: Date;
}

@InputType()
export class ElectionEditInput implements Partial<Election> {
    @IsAlphanumeric()
    @IsOptional()
    @Field({nullable: true, description: 'Name of election. a-zA-Z0-9 only'})
    title?: string;

    @IsOptional()
    @IsDate()
    @Field({nullable: true})
    startAt?: Date;

    @IsOptional()
    @IsDate()
    @Field({nullable: true})
    endAt?: Date;

    @Field({nullable: true, defaultValue: false})
    isOpen?: boolean;

    @Field({nullable: true, defaultValue: false})
    isStrict?: boolean;

    @Field({nullable: true, defaultValue: false})
    isExtended?: boolean;

    @Field({nullable: true, defaultValue: false})
    isAbnormal?: boolean;
}
