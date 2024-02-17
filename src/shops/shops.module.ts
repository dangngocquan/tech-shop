import { Module } from "@nestjs/common";
import { ShopsController } from "./shops.controller";
import { ShopsService } from "./shops.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shop } from "./entity/shop.entity";
import { ProductsService } from "src/products/products.service";
import { Product } from "src/products/entity/product.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Shop, Product])
    ],
    controllers: [ShopsController],
    providers: [ShopsService, ProductsService],
    exports: [ShopsService]
})
export class ShopsModule {}