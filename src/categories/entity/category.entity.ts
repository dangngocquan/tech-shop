import { Product } from "src/products/entity/product.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @ManyToMany(() => Product)
    @JoinTable({name: 'category_product'})
    products: Product[];
}