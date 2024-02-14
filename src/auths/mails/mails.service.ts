import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()

export class MailsService {
    constructor(
        private mailerService: MailerService
    ) {}

    async sendEmailConfirmation(email: string, otp: string): Promise<any> {
        return await this.mailerService.sendMail({
          to: email,
          subject: '[Tech Shop] Email Verification',
          template: "./confirmation", // `.hbs` extension is appended automatically
          context: {
            name: email,
            otp,
          },
        });
    }
}