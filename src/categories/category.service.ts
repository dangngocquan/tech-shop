import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async get(options: {}): Promise<Category[]> {
        return this.categoryRepository.find({
            where: {
             ...options,
            },
            relations: ['products'],
        });
    }

    async create(name: string): Promise<Category> {
        const category = new Category();
        category.name = name;
        return this.categoryRepository.save(category);
    }

    async update(categoryId: number, updateProperty: {}) {
        const categoryProperty = await this.categoryRepository.findOneBy({id : categoryId});
        return this.categoryRepository.save({
         ...categoryProperty,
         ...updateProperty
        });
    }

    async delete(categoryId: number) {
        return this.categoryRepository.delete(categoryId);
    }
}