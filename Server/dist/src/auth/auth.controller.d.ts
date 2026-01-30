import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
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
    logout(): Promise<{
        status: string;
        message: string;
    }>;
}
