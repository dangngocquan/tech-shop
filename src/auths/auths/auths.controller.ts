import { Body, Controller, Post } from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./auths.decorator";
import { SignupDto } from "./dto/signup.dto";
import { VerifyOtpSignupDto } from "./dto/verify-otp-signup.dto";

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

    @Public()
    @Post('signup')
    async signup(@Body() signupDto: SignupDto): Promise<any> {
        return this.authsService.signup(signupDto.email, signupDto.password, signupDto.name);
    }

    @Public()
    @Post('verify-otp-signup')
    async verifyOtpSignup(@Body() verifyOtpSignupDto: VerifyOtpSignupDto): Promise<any> {
        return this.authsService.verifyOtpSignup(verifyOtpSignupDto.email, verifyOtpSignupDto.otp);
    }
}