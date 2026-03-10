import { Module, Global } from "@nestjs/common";
import { MailService } from "./mail.service";
import { BullModule } from "@nestjs/bullmq";


@Global()
@Module({
    imports:[
        BullModule.registerQueue({
            name: "mail-queue",
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
