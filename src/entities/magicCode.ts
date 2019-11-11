import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('magic_codes')
export class MagicCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 50})
    code: string;

    @CreateDateColumn()
    createdAt: Date;
}