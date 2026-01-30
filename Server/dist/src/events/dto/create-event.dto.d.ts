export declare class CreateEventDto {
    title: string;
    description?: string;
    type: string;
    startDate: string;
    endDate: string;
    location?: string;
    participants?: number[];
    targetAudience?: string;
    levels?: string[];
    status?: string;
    isPublic?: boolean;
    attachments?: any[];
    maxParticipants?: number;
}
