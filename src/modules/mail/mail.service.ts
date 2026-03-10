import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";


@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        @InjectQueue("mail-queue") private readonly mailQueue: Queue,
    ){}

    async sendEmail(to: string, subject: string, html: string) {
        const job = await this.mailQueue.add(
            "send-email-job",
            { to, subject, html },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: true,
            },
        );
        this.logger.log(`[JOB ADDED] Job ID: ${job.id}`);
        return true;
    }
}
