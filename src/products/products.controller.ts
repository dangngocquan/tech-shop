import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Public } from "src/auths/auths/auths.decorator";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./entity/product.entity";
import { CheckPolicies } from "src/auths/policies/policy.decorator";
import { PolicyGuard } from "src/auths/policies/policy.guard";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Policy } from "src/auths/policies/policy.enum";

@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService,
    ) {}

    @Public()
    @Get()
    async get(@Query('id') id, @Query('name') name, @Query('shopId') shopId): Promise<Product[]> {
        const options = {};
        if (id !== undefined) options['id'] = Number(id);
        if (name !== undefined) options['name'] = name;
        if (shopId !== undefined) options['shopId'] = Number(shopId);
        return this.productsService.get(options);
    }

    @Post()
    @UseGuards(PolicyGuard)
    @CheckPolicies(Policy.CreateProduct)
    async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto.name, createProductDto.shopId);
    }

    @Put(':id')
    @UseGuards(PolicyGuard)
    @CheckPolicies(Policy.UpdateProduct)
    async update(@Param('id', ParseIntPipe) id, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
        return this.productsService.update(id, {name: updateProductDto.name});
    }

    @Delete(':id')
    @UseGuards(PolicyGuard)
    @CheckPolicies(Policy.DeleteProduct)
    async delete(@Param('id', ParseIntPipe) id): Promise<any> {
        return this.productsService.delete(id);
    }
}