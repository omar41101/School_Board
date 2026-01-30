import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private signAccessToken;
    private createRefreshTokenForUser;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        success: boolean;
        token: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
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
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        data: {
            profileCreated: boolean;
            phone: string | null;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            id: number;
            avatar: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            updatedAt: Date;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        success: boolean;
        token: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        data: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string;
            isActive: true;
            createdAt: Date;
        };
    }>;
    getMe(userId: number): Promise<{
        success: boolean;
        data: {
            firstName: string;
            lastName: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            id: number;
            avatar: string;
            isActive: boolean;
        };
    }>;
    updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<{
        status: string;
        token: string;
        accessToken: string;
        message: string;
    }>;
}
