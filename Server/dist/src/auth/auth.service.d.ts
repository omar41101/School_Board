import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        success: boolean;
        token: string;
        data: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            role: any;
            avatar: any;
            isActive: any;
            createdAt: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        token: string;
        data: {
            profileCreated: boolean;
            phone: string | null;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: number;
            avatar: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getMe(userId: number): Promise<{
        success: boolean;
        data: {
            firstName: string;
            lastName: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: number;
            avatar: string;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<{
        status: string;
        token: string;
        message: string;
    }>;
}
