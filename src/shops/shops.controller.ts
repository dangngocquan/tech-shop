import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ShopsService } from "./shops.service";
import { Public } from "src/auths/auths/auths.decorator";
import { Shop } from "./entity/shop.entity";
import { PolicyGuard } from "src/auths/policies/policy.guard";
import { CheckPolicies } from "src/auths/policies/policy.decorator";
import { Policy } from "src/auths/policies/policy.enum";

@Controller('shops')
export class ShopsController {
    constructor(
        public shopsService: ShopsService
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
    async create(@Body() createShopDto: Shop, @Req() request): Promise<Shop> {
        return this.shopsService.create(createShopDto.name, request['user']['id']);
    }

    @Put(':id')
    @UseGuards(PolicyGuard)
    @CheckPolicies(Policy.UpdateShop)
    async update(@Param('id', ParseIntPipe) id, @Body() updateShopDto: Shop) {
        return this.shopsService.update(id, {name: updateShopDto.name});
    }

    @Delete(':id')
    @UseGuards(PolicyGuard)
    @CheckPolicies(Policy.DeleteShop)
    async delete(@Param('id', ParseIntPipe) id) {
        return this.shopsService.delete(id);
    }

}