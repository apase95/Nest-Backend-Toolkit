// import { Processor, WorkerHost } from "@nestjs/bullmq";
// import { Job } from "bullmq";
// import { Logger } from "@nestjs/common";
// import { sleep } from "src/common/utils";


// @Processor("mail-queue")
// export class MailProcessor extends WorkerHost {
//     private readonly logger = new Logger(MailProcessor.name);

//     async process(job: Job<any, any, string>): Promise<any> {
//         this.logger.log(`Processing job ${job.id} with type: ${job.name} and data: ${JSON.stringify(job.data)}`);

//         const { to, subject, html } = job.data;

//         try {
//             await sleep(2000);
//             this.logger.log(`[SUCCESS] Job ID: ${job.id}. Email sent to ${to} with subject "${subject}"`);
//             return { status: "Sent", timestamp: new Date().toISOString() };
//         } catch (error) {
//             this.logger.error(`[FAILED] Job ID: ${job.id}, error`);
//             throw error;
//         }
//     };
// };