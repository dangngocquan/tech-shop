import { Module } from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { AuthsController } from "./auths.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { MailsModule } from "../mails/mails.module";
import { ConfigService } from "@nestjs/config";



@Module({
    imports: [
        UsersModule,
        MailsModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { 
                    expiresIn: '600s' 
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthsController],
    providers: [AuthsService],
    exports: [AuthsService],
})
export class AuthsModule {}