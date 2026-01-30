import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        data: {
            events: ({
                organizer: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                };
            } & {
                type: import(".prisma/client").$Enums.EventType;
                description: string | null;
                title: string;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.EventStatus;
                isPublic: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                startDate: Date;
                endDate: Date;
                location: string | null;
                participants: import("@prisma/client/runtime/library").JsonValue | null;
                targetAudience: import(".prisma/client").$Enums.EventTargetAudience;
                levels: import("@prisma/client/runtime/library").JsonValue | null;
                maxParticipants: number | null;
                organizerId: number | null;
            })[];
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            event: {
                organizer: {
                    phone: string | null;
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                    role: import(".prisma/client").$Enums.Role;
                    createdAt: Date;
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    updatedAt: Date;
                };
            } & {
                type: import(".prisma/client").$Enums.EventType;
                description: string | null;
                title: string;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.EventStatus;
                isPublic: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                startDate: Date;
                endDate: Date;
                location: string | null;
                participants: import("@prisma/client/runtime/library").JsonValue | null;
                targetAudience: import(".prisma/client").$Enums.EventTargetAudience;
                levels: import("@prisma/client/runtime/library").JsonValue | null;
                maxParticipants: number | null;
                organizerId: number | null;
            };
        };
    }>;
    create(createEventDto: CreateEventDto, userId: number): Promise<{
        status: string;
        data: {
            event: {
                organizer: {
                    phone: string | null;
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                    role: import(".prisma/client").$Enums.Role;
                    createdAt: Date;
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    updatedAt: Date;
                };
            } & {
                type: import(".prisma/client").$Enums.EventType;
                description: string | null;
                title: string;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.EventStatus;
                isPublic: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                startDate: Date;
                endDate: Date;
                location: string | null;
                participants: import("@prisma/client/runtime/library").JsonValue | null;
                targetAudience: import(".prisma/client").$Enums.EventTargetAudience;
                levels: import("@prisma/client/runtime/library").JsonValue | null;
                maxParticipants: number | null;
                organizerId: number | null;
            };
        };
    }>;
    update(id: number, updateEventDto: UpdateEventDto): Promise<{
        status: string;
        data: {
            event: {
                organizer: {
                    phone: string | null;
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                    role: import(".prisma/client").$Enums.Role;
                    createdAt: Date;
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    updatedAt: Date;
                };
            } & {
                type: import(".prisma/client").$Enums.EventType;
                description: string | null;
                title: string;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.EventStatus;
                isPublic: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                startDate: Date;
                endDate: Date;
                location: string | null;
                participants: import("@prisma/client/runtime/library").JsonValue | null;
                targetAudience: import(".prisma/client").$Enums.EventTargetAudience;
                levels: import("@prisma/client/runtime/library").JsonValue | null;
                maxParticipants: number | null;
                organizerId: number | null;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
