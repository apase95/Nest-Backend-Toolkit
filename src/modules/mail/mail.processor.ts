import { Processor, WorkerHost } from "@nestjs/bullmq";


@Processor("mail-queue")
export class MailProcessor extends WorkerHost {

};