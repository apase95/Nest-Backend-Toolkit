import { Injectable, Logger } from "@nestjs/common";


@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    async sendEmail(to: string, subject: string, html: string) {
        this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        this.logger.log(`[CONTENT]: ${html}`);
        return true;
    }
}
