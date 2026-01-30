import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        totalPages: number;
        currentPage: number;
        data: {
            users: {
                phone: string;
                firstName: string;
                lastName: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
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
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
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
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
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
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
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
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
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
                id: number;
                avatar: string;
                isActive: boolean;
                lastLogin: Date;
                createdAt: Date;
                updatedAt: Date;
            };
        };
    }>;
}
