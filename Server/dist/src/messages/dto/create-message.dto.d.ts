export declare class CreateMessageDto {
    recipientId: number;
    subject: string;
    content: string;
    attachments?: Array<Record<string, unknown>>;
    priority?: string;
    category?: string;
}
