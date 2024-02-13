import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthsService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async login(email: string, password: string): Promise<any> {
        const user = await this.userService.get({email, password});
        if (!user) throw new UnauthorizedException();
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }

        return {
            token: await this.jwtService.signAsync(payload),
        }
    }
}