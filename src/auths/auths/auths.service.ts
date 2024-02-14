import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { MailsService } from "../mails/mails.service";
import { User } from "src/users/entity/user.entity";

@Injectable()
export class AuthsService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private mailsService: MailsService,
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

    // Signup - Step 01
    async signup(email: string, password: string, name: string): Promise<any> {
        const existedUser = await this.userService.get({email});
        if (existedUser) 
            throw new ConflictException({
                describe: 'This email already used by another user',
            });

        // Create OTP code
        const otp: string = (1000000 +  Math.round(Math.random() * 999999)).toString().slice(1);
        await this.cacheManager.set(
            email + '-' + otp,
            {
                email,
                password,
                name,
            },
            300000
        )
        // Send email confirmation
        return await this.mailsService.sendEmailConfirmation(email, otp);
    }

    // Signup - Step 02
    async verifyOtpSignup(email: string, otp: string): Promise<any> {
        // Check email-otp in Cache
        const cacheUser = await this.cacheManager.get(email + '-' + otp);
        if (cacheUser === null || cacheUser === undefined) {
            throw new UnauthorizedException({
                describe: 'Invalid OTP',
            });
        }
        // Create user in database
        const user = new User();
        user.email = cacheUser['email'];
        user.password = cacheUser['password'];
        user.name = cacheUser['name'];
        await this.userService.create(user);
        // Delete email-otp from Cache
        await this.cacheManager.del(email + '-' + otp);
        // Login
        return this.login(email, user.password);
    }

}