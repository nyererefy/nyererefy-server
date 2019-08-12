import {Field, ID, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Notifying people about elections.
 */
@ObjectType()
@Entity('notifications')
export class Notification {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
}

