import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Shop } from "./entity/shop.entity";
import { Repository } from "typeorm";

@Injectable()
export class ShopsService {
    constructor(
        @InjectRepository(Shop)
        private shopsRepository: Repository<Shop>,
    ) {}

    async get(options: {}): Promise<Shop[]> {
        return this.shopsRepository.find({
            where: {
             ...options,
            },
            relations: ['owner', 'products'],
        });
    }

    async create(name: string, ownerId: number): Promise<Shop> {
        const shop = new Shop();
        shop.name = name;
        shop.ownerId = ownerId;
        return this.shopsRepository.save(shop);
    }

    async update(shopId: number, updateProperty: {}) {
        const shopProperty = await this.shopsRepository.findOneBy({id : shopId});
        return this.shopsRepository.save({
         ...shopProperty,
         ...updateProperty
        });
    }

    async delete(shopId: number) {
        return this.shopsRepository.delete(shopId);
    }
}