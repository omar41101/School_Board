import { Role } from '../../auth/decorators/roles.decorator';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    isActive?: boolean;
    role?: Role;
}
