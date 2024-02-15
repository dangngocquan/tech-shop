import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Body, ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { MailsService } from "../mails/mails.service";
import { User } from "src/users/entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { LoginTicket, OAuth2Client } from "google-auth-library";

@Injectable()
export class AuthsService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private mailsService: MailsService,
        private configService: ConfigService,
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
        return this.mailsService.sendEmailConfirmation(email, otp);
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

    // Forget password Step 01
    async forgetPassword(email: string): Promise<any> {
        const existedUser = await this.userService.get({email});
        if (!existedUser) {
            throw new UnauthorizedException({
                describe: 'This email is not registered.',
            });
        }
        // Create OTP code
        const otp: string = (1000000 +  Math.round(Math.random() * 999999)).toString().slice(1);
        await this.cacheManager.set(
            'forget-' + email + '-' + otp,
            {
                email
            },
            300000
        )
        // Send email confirmation
        return this.mailsService.sendEmailConfirmation(email, otp);
    }

    // Forget password Step 02
    async verifyOtpForgetPassword(email: string, otp: string): Promise<any> {
        // Check email-otp in Cache
        const cacheUser = await this.cacheManager.get('forget-' + email + '-' + otp);
        if (cacheUser === null || cacheUser === undefined) {
            throw new UnauthorizedException({
                describe: 'Invalid OTP',
            });
        }
        // Delete email-otp from Cache
        await this.cacheManager.del('forget-' + email + '-' + otp);
        // Return a sercurity token 
        const user = await this.userService.get({email});
        const payload = {
            id: user.id,
        }
        return {
            sercurityToken: await this.jwtService.signAsync(payload)
        }   
    }

    // Forget password Step 03
    async resetForgetPassword(sercurityToken: string, newPassword: string) {
        const user = await this.jwtService.verifyAsync(
            sercurityToken, 
            {
                secret: this.configService.get<string>('JWT_SECRET')
            }
        );
        await this.userService.updatePassword(user.id, newPassword);
        
        return this.login(user.email, newPassword);
    }

    // verify google token
    async verifyGoogleToken(token: string): Promise<{}> {
        const client = new OAuth2Client(
            this.configService.get<string>('GOOGLE_CLIENT_ID'),
            this.configService.get<string>('GOOGLE_CLIENT_SECRET')
        );
        var ticket: LoginTicket;
        try {
            ticket = await client.verifyIdToken({
                idToken: token,
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });
        } catch {
            throw new UnauthorizedException(
                'Verify google failed.'
            );
        }
        return ticket.getPayload();
    }

    // Login by google
    async loginGoogle(token: string): Promise<any> {
        const profile = await this.verifyGoogleToken(token);
        // profile = {
        //     "iss": "https://accounts.google.com",
        //     "azp": "407408718192.apps.googleusercontent.com",
        //     "aud": "407408718192.apps.googleusercontent.com",
        //     "sub": "112249634453935320421",
        //     "email": "dangngocquan104@gmail.com",
        //     "email_verified": true,
        //     "at_hash": "x35gfzbsg9OaSamct9099A",
        //     "name": "Quân Đặng Ngọc",
        //     "picture": "https://lh3.googleusercontent.com/a/ACg8ocJnCEN8XeXg560r08AHPMaR-CVvinuy2C1hWniDinojK20=s96-c",
        //     "given_name": "Quân",
        //     "family_name": "Đặng Ngọc",
        //     "locale": "en",
        //     "iat": 1707986067,
        //     "exp": 1707989667
        // }
        const existUser = await this.userService.get({email: profile['email']});
        if (!existUser) {
            throw new UnauthorizedException({
                describe: 'This email is not registered.',
            });
        }
        // Return token
        const payload = {
            id: existUser.id,
            email: existUser.email,
            name: existUser.name,
            role: existUser.role,
        }
        return {
            token: await this.jwtService.signAsync(payload),
        }
    }

    async signupGoogle(token: string) {
        const profile = await this.verifyGoogleToken(token);
        const existUser = await this.userService.get({email: profile['email']});
        if (!existUser) {
            // Create random password
            const password: string = (1000000 +  Math.round(Math.random() * 999999)).toString().slice(1);
            // Create user in database
            const user = new User();
            user.email = profile['email'];
            user.password = password;
            user.name = profile['name'];
            await this.userService.create(user);
            // Send email register success
            await this.mailsService.sendEmailDefaultPassword(user.email, user.password);
            // Login
            return this.login(user.email, user.password);
        } else {
            // Return token
            const payload = {
                id: existUser.id,
                email: existUser.email,
                name: existUser.name,
                role: existUser.role,
            }
            return {
                token: await this.jwtService.signAsync(payload),
            }
        }
    }

}