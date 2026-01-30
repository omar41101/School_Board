import { PrismaService } from '../prisma/prisma.service';
import { CreateCantineDto } from './dto/create-cantine.dto';
import { UpdateCantineDto } from './dto/update-cantine.dto';
export declare class CantineService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        data: {
            orders: ({
                student: {
                    user: {
                        firstName: string;
                        lastName: string;
                        id: number;
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
                };
            } & {
                items: import("@prisma/client/runtime/library").JsonValue;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CantineStatus;
                studentId: number;
                date: Date;
                mealType: import(".prisma/client").$Enums.MealType;
                paymentStatus: string;
                specialInstructions: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            })[];
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            order: {
                student: {
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
                };
            } & {
                items: import("@prisma/client/runtime/library").JsonValue;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CantineStatus;
                studentId: number;
                date: Date;
                mealType: import(".prisma/client").$Enums.MealType;
                paymentStatus: string;
                specialInstructions: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            };
        };
    }>;
    create(createCantineDto: CreateCantineDto): Promise<{
        status: string;
        data: {
            order: {
                student: {
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
                };
            } & {
                items: import("@prisma/client/runtime/library").JsonValue;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CantineStatus;
                studentId: number;
                date: Date;
                mealType: import(".prisma/client").$Enums.MealType;
                paymentStatus: string;
                specialInstructions: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            };
        };
    }>;
    update(id: number, updateCantineDto: UpdateCantineDto): Promise<{
        status: string;
        data: {
            order: {
                student: {
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
                };
            } & {
                items: import("@prisma/client/runtime/library").JsonValue;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CantineStatus;
                studentId: number;
                date: Date;
                mealType: import(".prisma/client").$Enums.MealType;
                paymentStatus: string;
                specialInstructions: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            };
        };
    }>;
    cancel(id: number): Promise<{
        status: string;
        data: {
            order: {
                student: {
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
                };
            } & {
                items: import("@prisma/client/runtime/library").JsonValue;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CantineStatus;
                studentId: number;
                date: Date;
                mealType: import(".prisma/client").$Enums.MealType;
                paymentStatus: string;
                specialInstructions: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
