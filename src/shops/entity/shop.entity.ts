import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({type: 'bigint', nullable: false})
    ownerId: number;
}