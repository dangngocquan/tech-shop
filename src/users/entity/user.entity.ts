import { Shop } from "src/shops/entity/shop.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({type: 'varchar', length: 255, default: 'member'})
    role: string;

    @OneToMany(() => Shop, (shop: Shop) => shop.owner)
    shops: Shop[];
}