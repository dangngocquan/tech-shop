import { Body, Controller, Post } from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./auths.decorator";

@Controller('auths')
export class AuthsController {
    constructor(
        private authsService: AuthsService,
    ) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.authsService.login(loginDto.email, loginDto.password);
    }
}