import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ShopsService } from "./shops.service";
import { Public } from "src/auths/auths/auths.decorator";
import { Shop } from "./entity/shop.entity";
import { PolicyGuard } from "src/auths/policies/policy.guard";
import { CheckPolicies } from "src/auths/policies/policy.decorator";
import { Policy } from "src/auths/policies/policy.enum";

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
    @UseGuards(PolicyGuard)
    @CheckPolicies([Policy.CreateShop])
    async create(@Body() createShopDto: Shop): Promise<Shop> {
        return this.shopsService.create(createShopDto.name, createShopDto.ownerId);
    }




}