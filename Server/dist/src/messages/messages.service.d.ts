import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        inbox?: boolean;
        sent?: boolean;
        page?: number;
        limit?: number;
    }, userId: number): Promise<{
        status: string;
        results: number;
        totalPages: number;
        currentPage: number;
        data: {
            messages: ({
                sender: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                };
                recipient: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                };
            } & {
                createdAt: Date;
                id: number;
                updatedAt: Date;
                subject: string;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                recipientId: number;
                content: string;
                priority: import(".prisma/client").$Enums.MessagePriority;
                category: import(".prisma/client").$Enums.MessageCategory;
                senderId: number;
                isRead: boolean;
                readAt: Date | null;
            })[];
        };
    }>;
    findOne(id: number, userId: number): Promise<{
        status: string;
        data: {
            message: {
                sender: {
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
                recipient: {
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
                createdAt: Date;
                id: number;
                updatedAt: Date;
                subject: string;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                recipientId: number;
                content: string;
                priority: import(".prisma/client").$Enums.MessagePriority;
                category: import(".prisma/client").$Enums.MessageCategory;
                senderId: number;
                isRead: boolean;
                readAt: Date | null;
            };
        };
    }>;
    create(createMessageDto: CreateMessageDto, senderId: number): Promise<{
        status: string;
        data: {
            message: {
                sender: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                };
                recipient: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                };
            } & {
                createdAt: Date;
                id: number;
                updatedAt: Date;
                subject: string;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                recipientId: number;
                content: string;
                priority: import(".prisma/client").$Enums.MessagePriority;
                category: import(".prisma/client").$Enums.MessageCategory;
                senderId: number;
                isRead: boolean;
                readAt: Date | null;
            };
        };
    }>;
    update(id: number, updateMessageDto: UpdateMessageDto, userId: number): Promise<{
        status: string;
        data: {
            message: {
                sender: {
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
                recipient: {
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
                createdAt: Date;
                id: number;
                updatedAt: Date;
                subject: string;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                recipientId: number;
                content: string;
                priority: import(".prisma/client").$Enums.MessagePriority;
                category: import(".prisma/client").$Enums.MessageCategory;
                senderId: number;
                isRead: boolean;
                readAt: Date | null;
            };
        };
    }>;
    remove(id: number, userId: number): Promise<{
        status: string;
        message: string;
    }>;
}
