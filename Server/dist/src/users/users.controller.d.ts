import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        total: number;
        totalPages: number;
        currentPage: number;
        data: {
            users: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            }[];
        };
    }>;
    getMe(userId: number): Promise<{
        status: string;
        data: {
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            };
        };
    }>;
    updateMe(userId: number, updateUserDto: UpdateUserDto): Promise<{
        status: string;
        data: {
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            };
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            };
        };
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        status: string;
        data: {
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
    deactivate(id: number): Promise<{
        status: string;
        data: {
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                updatedAt: Date;
            };
        };
    }>;
}
