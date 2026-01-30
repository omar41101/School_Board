import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
export declare class ParentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        status: string;
        results: number;
        total: number;
        totalPages: number;
        currentPage: number;
        data: {
            parents: ({
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
                children: {
                    bloodGroup: string | null;
                    allergies: import("@prisma/client/runtime/library").JsonValue | null;
                    medicalConditions: import("@prisma/client/runtime/library").JsonValue | null;
                    matricule: string;
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    level: string;
                    className: string;
                    section: string | null;
                    parentId: number | null;
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
                    admissionDate: Date;
                    status: import(".prisma/client").$Enums.StudentStatus;
                    emergencyContactName: string | null;
                    emergencyContactRelationship: string | null;
                    emergencyContactPhone: string | null;
                    previousSchoolName: string | null;
                    previousSchoolYear: string | null;
                }[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.ParentStatus;
                emergencyContactName: string | null;
                emergencyContactRelationship: string | null;
                emergencyContactPhone: string | null;
            })[];
        };
    }>;
    findByUserId(userId: number): Promise<{
        status: string;
        data: {
            parent: {
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
                children: ({
                    user: {
                        firstName: string;
                        lastName: string;
                        id: number;
                        avatar: string;
                    };
                } & {
                    bloodGroup: string | null;
                    allergies: import("@prisma/client/runtime/library").JsonValue | null;
                    medicalConditions: import("@prisma/client/runtime/library").JsonValue | null;
                    matricule: string;
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    level: string;
                    className: string;
                    section: string | null;
                    parentId: number | null;
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
                    admissionDate: Date;
                    status: import(".prisma/client").$Enums.StudentStatus;
                    emergencyContactName: string | null;
                    emergencyContactRelationship: string | null;
                    emergencyContactPhone: string | null;
                    previousSchoolName: string | null;
                    previousSchoolYear: string | null;
                })[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.ParentStatus;
                emergencyContactName: string | null;
                emergencyContactRelationship: string | null;
                emergencyContactPhone: string | null;
            };
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            parent: {
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
                children: {
                    bloodGroup: string | null;
                    allergies: import("@prisma/client/runtime/library").JsonValue | null;
                    medicalConditions: import("@prisma/client/runtime/library").JsonValue | null;
                    matricule: string;
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    level: string;
                    className: string;
                    section: string | null;
                    parentId: number | null;
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
                    admissionDate: Date;
                    status: import(".prisma/client").$Enums.StudentStatus;
                    emergencyContactName: string | null;
                    emergencyContactRelationship: string | null;
                    emergencyContactPhone: string | null;
                    previousSchoolName: string | null;
                    previousSchoolYear: string | null;
                }[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.ParentStatus;
                emergencyContactName: string | null;
                emergencyContactRelationship: string | null;
                emergencyContactPhone: string | null;
            };
        };
    }>;
    create(createParentDto: CreateParentDto): Promise<{
        status: string;
        data: {
            parent: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.ParentStatus;
                emergencyContactName: string | null;
                emergencyContactRelationship: string | null;
                emergencyContactPhone: string | null;
            };
        };
    }>;
    update(id: number, updateParentDto: UpdateParentDto): Promise<{
        status: string;
        data: {
            parent: {
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
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                createdAt: Date;
                id: number;
                userId: number;
                updatedAt: Date;
                addressStreet: string | null;
                addressCity: string | null;
                addressState: string | null;
                addressZipCode: string | null;
                addressCountry: string | null;
                status: import(".prisma/client").$Enums.ParentStatus;
                emergencyContactName: string | null;
                emergencyContactRelationship: string | null;
                emergencyContactPhone: string | null;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
