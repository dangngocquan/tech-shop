import { Body, Controller, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ShopsService } from "./shops.service";
import { Public } from "src/auths/auths/auths.decorator";
import { Shop } from "./entity/shop.entity";

@Controller('shops')
export class ShopsController {
    constructor(
        private shopsService: ShopsService
    ) { }

    @Public()
    @Get()
    async get(@Query('id') id, @Query('name') name, @Query('ownerId') ownerId): Promise<Shop[]> {
        const options = {};
        if (id !== undefined) options['id'] = Number(id);
        if (name !== undefined) options['name'] = name;
        if (ownerId !== undefined) options['ownerId'] = Number(ownerId);
        return this.shopsService.get(options);
    }

    @Post()
    async create(@Body() createShopDto: Shop): Promise<Shop> {
        return this.shopsService.create(createShopDto.name, createShopDto.ownerId);
    }




}