import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Firebase notifications.
 */
@Entity('firebase_tokens')
export class Alert {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    device: string;
}

