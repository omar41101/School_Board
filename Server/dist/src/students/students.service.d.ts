import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        total: number;
        totalPages: number;
        currentPage: number;
        data: {
            students: ({
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
                parent: {
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
        };
    }>;
    findByUserId(userId: number): Promise<{
        status: string;
        data: {
            student: {
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
                parent: {
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
            };
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            student: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    id: number;
                    avatar: string;
                };
                parent: {
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
            };
        };
    }>;
    create(createStudentDto: CreateStudentDto): Promise<{
        status: string;
        data: {
            student: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
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
            };
        };
    }>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<{
        status: string;
        data: {
            student: {
                user: {
                    phone: string;
                    firstName: string;
                    lastName: string;
                    email: string;
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
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
