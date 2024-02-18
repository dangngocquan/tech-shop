import { Module } from "@nestjs/common";
import { Category } from "./entity/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesController } from "./category.controller";
import { CategoriesService } from "./category.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule {}