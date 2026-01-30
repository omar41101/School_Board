import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
export declare class ParentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        status: string;
        results: number;
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
                    id: number;
                    createdAt: Date;
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
                    userId: number;
                }[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                id: number;
                createdAt: Date;
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
                userId: number;
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
                    id: number;
                    createdAt: Date;
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
                    userId: number;
                }[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                id: number;
                createdAt: Date;
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
                userId: number;
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
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
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
                    id: number;
                    createdAt: Date;
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
                    userId: number;
                }[];
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                id: number;
                createdAt: Date;
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
                userId: number;
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
                id: number;
                createdAt: Date;
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
                userId: number;
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
                    id: number;
                    avatar: string | null;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                relationship: import(".prisma/client").$Enums.Relationship;
                occupation: string | null;
                id: number;
                createdAt: Date;
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
                userId: number;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
