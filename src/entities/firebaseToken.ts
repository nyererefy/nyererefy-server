import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Field, InputType} from "type-graphql";
import {User} from "./user";

/**
 * Firebase notifications.
 * If not updated for so long then it is deleted automatically.
 */
@Entity('firebase_tokens')
export class FirebaseToken {
    @PrimaryGeneratedColumn()
    id: number;

    /* Device Id*/
    @Column({unique: true, length: 100})
    deviceId: string;

    @Column({type: "text"})
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, s => s.firebaseTokens)
    user: User;
}

@InputType()
export class FirebaseTokenInput implements Partial<FirebaseToken> {
    @Field()
    token: string;

    @Field()
    deviceId: string;
}


@InputType()
export class AlertInput {
    @Field()
    title: string;

    @Field()
    body: string;
}
