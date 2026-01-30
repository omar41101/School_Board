import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        total: number;
        totalPages: number;
        currentPage: number;
        data: {
            teachers: ({
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
            } & {
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                employeeId: string;
                qualification: string;
                specialization: string;
                salary: import("@prisma/client/runtime/library").Decimal;
                subjects: import("@prisma/client/runtime/library").JsonValue | null;
                experience: number;
                classes: import("@prisma/client/runtime/library").JsonValue | null;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                documents: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                joiningDate: Date;
            })[];
        };
    }>;
    getMe(userId: number): Promise<{
        status: string;
        data: {
            teacher: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: import(".prisma/client").$Enums.Role;
                    id: number;
                    avatar: string;
                    isActive: boolean;
                };
            } & {
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                employeeId: string;
                qualification: string;
                specialization: string;
                salary: import("@prisma/client/runtime/library").Decimal;
                subjects: import("@prisma/client/runtime/library").JsonValue | null;
                experience: number;
                classes: import("@prisma/client/runtime/library").JsonValue | null;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                documents: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                joiningDate: Date;
            };
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            teacher: {
                user: {
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
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                employeeId: string;
                qualification: string;
                specialization: string;
                salary: import("@prisma/client/runtime/library").Decimal;
                subjects: import("@prisma/client/runtime/library").JsonValue | null;
                experience: number;
                classes: import("@prisma/client/runtime/library").JsonValue | null;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                documents: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                joiningDate: Date;
            };
        };
    }>;
    create(createTeacherDto: CreateTeacherDto): Promise<{
        status: string;
        data: {
            teacher: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
            } & {
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                employeeId: string;
                qualification: string;
                specialization: string;
                salary: import("@prisma/client/runtime/library").Decimal;
                subjects: import("@prisma/client/runtime/library").JsonValue | null;
                experience: number;
                classes: import("@prisma/client/runtime/library").JsonValue | null;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                documents: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                joiningDate: Date;
            };
        };
    }>;
    update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<{
        status: string;
        data: {
            teacher: {
                user: {
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
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                employeeId: string;
                qualification: string;
                specialization: string;
                salary: import("@prisma/client/runtime/library").Decimal;
                subjects: import("@prisma/client/runtime/library").JsonValue | null;
                experience: number;
                classes: import("@prisma/client/runtime/library").JsonValue | null;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                documents: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                joiningDate: Date;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
