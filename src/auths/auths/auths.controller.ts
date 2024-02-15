import { Body, Controller, Post } from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./auths.decorator";
import { SignupDto } from "./dto/signup.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetForgetPassword } from "./dto/reset-forget-password.dto";
import { GoogleDto } from "./dto/google.dto";

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
    async verifyOtpSignup(@Body() verifyOtpSignupDto: VerifyOtpDto): Promise<any> {
        return this.authsService.verifyOtpSignup(verifyOtpSignupDto.email, verifyOtpSignupDto.otp);
    }

    @Public()
    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<any> {
        return this.authsService.forgetPassword(forgetPasswordDto.email);
    }

    @Public()
    @Post('verify-otp-forget-password')
    async verifyOtpForgetPassword(@Body() verifyOtpForgetPasswordDto: VerifyOtpDto): Promise<any> {
        return this.authsService.verifyOtpForgetPassword(
            verifyOtpForgetPasswordDto.email, 
            verifyOtpForgetPasswordDto.otp
        );
    }

    @Public()
    @Post('reset-forget-password')
    async resetForgetPassword(@Body() resetForgetPasswordDto: ResetForgetPassword): Promise<any> {
        return this.authsService.resetForgetPassword(
            resetForgetPasswordDto.sercurityToken, 
            resetForgetPasswordDto.newPassword
        );
    }

    @Public()
    @Post('login-google')
    async loginGoogle(@Body() loginGoogleDto: GoogleDto): Promise<any> {
        return this.authsService.loginGoogle(loginGoogleDto.idToken);
    }

    @Public()
    @Post('signup-google')
    async signupGoogle(@Body() signupGoogleDto: GoogleDto): Promise<any> {
        return this.authsService.signupGoogle(signupGoogleDto.idToken);
    }
}