import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        status: string;
        results: number;
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number;
                joiningDate: Date;
            })[];
        };
    }>;
    findByUserId(userId: number): Promise<{
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number;
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
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number;
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number;
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
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number;
                joiningDate: Date;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
