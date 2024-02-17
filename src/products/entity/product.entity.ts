import { Shop } from "src/shops/entity/shop.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({name: 'shop_id', type: 'bigint'})
    shopId: number;

    @ManyToOne(() => Shop)
    @JoinColumn({name:'shop_id'})
    shop: Shop;
}