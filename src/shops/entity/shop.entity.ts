import { Product } from "src/products/entity/product.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({name: 'owner_id', type: 'bigint'})
    ownerId: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'owner_id'})
    owner: User;

    @OneToMany(() => Product, (product: Product) => product.shop)
    products: Product[];
}