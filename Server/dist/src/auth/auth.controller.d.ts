import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
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
    refresh(dto: RefreshTokenDto): Promise<{
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
    getCurrent(userId: number): Promise<{
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
    logout(): Promise<{
        status: string;
        message: string;
    }>;
}
