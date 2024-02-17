import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Shop } from "src/shops/entity/shop.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async get(options: {}): Promise<Product[]> {
        return this.productRepository.find({
            where: {
             ...options,
            },
            relations: ['shop'],
        });
    }

    async create(name: string, shopId: number): Promise<Product> {
        const product = new Product();
        product.name = name;
        product.shopId = shopId;
        return this.productRepository.save(product);
    }

    async update(productId: number, updateProperty: {}) {
        const productProperty = await this.productRepository.findOneBy({id : productId});
        return this.productRepository.save({
            ...productProperty,
            ...updateProperty
        });
    }

    async delete(productId: number) {
        return this.productRepository.delete(productId);
    }
}