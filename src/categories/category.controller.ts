import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { CategoriesService } from "./category.service";
import { Public } from "src/auths/auths/auths.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./entity/category.entity";
import { updateCategoryDto } from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService,
    ) {}

    @Public()
    @Get()
    async get(@Query('id') id, @Query('name') name): Promise<Category[]> {
        const options = {};
        if (id !== undefined) options['id'] = Number(id);
        if (name !== undefined) options['name'] = name;
        return this.categoriesService.get(options);
    }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto.name);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id, @Body() updateCategoryDto: updateCategoryDto): Promise<Category> {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id): Promise<any> {
        return this.categoriesService.delete(id);
    }
}