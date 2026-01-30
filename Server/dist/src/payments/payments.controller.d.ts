import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        data: {
            payments: ({
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
            } & {
                type: import(".prisma/client").$Enums.PaymentType;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester | null;
                studentId: number;
                remarks: string | null;
                dueDate: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                paidDate: Date | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
                transactionId: string | null;
                receiptNumber: string | null;
                invoiceUrl: string | null;
            })[];
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            payment: {
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
            } & {
                type: import(".prisma/client").$Enums.PaymentType;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester | null;
                studentId: number;
                remarks: string | null;
                dueDate: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                paidDate: Date | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
                transactionId: string | null;
                receiptNumber: string | null;
                invoiceUrl: string | null;
            };
        };
    }>;
    create(createPaymentDto: CreatePaymentDto): Promise<{
        status: string;
        data: {
            payment: {
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
            } & {
                type: import(".prisma/client").$Enums.PaymentType;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester | null;
                studentId: number;
                remarks: string | null;
                dueDate: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                paidDate: Date | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
                transactionId: string | null;
                receiptNumber: string | null;
                invoiceUrl: string | null;
            };
        };
    }>;
    update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<{
        status: string;
        data: {
            payment: {
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
            } & {
                type: import(".prisma/client").$Enums.PaymentType;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester | null;
                studentId: number;
                remarks: string | null;
                dueDate: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                paidDate: Date | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
                transactionId: string | null;
                receiptNumber: string | null;
                invoiceUrl: string | null;
            };
        };
    }>;
    markAsPaid(id: number): Promise<{
        status: string;
        data: {
            payment: {
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
            } & {
                type: import(".prisma/client").$Enums.PaymentType;
                createdAt: Date;
                id: number;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester | null;
                studentId: number;
                remarks: string | null;
                dueDate: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                paidDate: Date | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
                transactionId: string | null;
                receiptNumber: string | null;
                invoiceUrl: string | null;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
