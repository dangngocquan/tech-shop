import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    // GET
    @Get()
    async get(@Query('id', ParseIntPipe) id, @Query('email') email): Promise<User> {
        const options = {};
        if (id !== undefined) options['id'] = id;
        if (email !== undefined) options['email'] = email;
        return this.usersService.get(options);
    }

    // POST
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = new User();
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.name = createUserDto.name;
        return this.usersService.create(user);
    }

    // UPDATE
    @Put('/password/:id')
    async updatePassword(@Param('id', ParseIntPipe) id, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, {password: updateUserDto.value});
    }

    @Put('/name/:id')
    async updateName(@Param('id', ParseIntPipe) id, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, {name: updateUserDto.value});
    }

    // DELETE
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id): Promise<any> {
        return this.usersService.delete(id);
    }


}