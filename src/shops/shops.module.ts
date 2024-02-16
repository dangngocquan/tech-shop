import { Module } from "@nestjs/common";
import { ShopsController } from "./shops.controller";
import { ShopsService } from "./shops.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shop } from "./entity/shop.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Shop])],
    controllers: [ShopsController],
    providers: [ShopsService],
    exports: [ShopsService]
})
export class ShopsModule {}