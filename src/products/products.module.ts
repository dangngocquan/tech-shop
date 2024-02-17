import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ShopsService } from "src/shops/shops.service";
import { Shop } from "src/shops/entity/shop.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Shop]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ShopsService],
    exports: [ProductsService],
})
export class ProductsModule {}