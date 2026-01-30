import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        status: string;
        results: number;
        data: {
            assignments: ({
                teacher: {
                    user: {
                        firstName: string;
                        lastName: string;
                        id: number;
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
                course: {
                    name: string;
                    id: number;
                    code: string;
                };
            } & {
                description: string;
                title: string;
                level: string;
                className: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.AssignmentStatus;
                subject: string;
                teacherId: number;
                courseId: number;
                totalMarks: import("@prisma/client/runtime/library").Decimal;
                dueDate: Date;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                submissions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            assignment: {
                teacher: {
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
                course: {
                    name: string;
                    description: string | null;
                    level: string;
                    schedule: import("@prisma/client/runtime/library").JsonValue | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    code: string;
                    subject: string;
                    teacherId: number | null;
                    credits: number;
                    maxStudents: number;
                    enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                    syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                    academicYear: string;
                    semester: import(".prisma/client").$Enums.Semester;
                };
            } & {
                description: string;
                title: string;
                level: string;
                className: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.AssignmentStatus;
                subject: string;
                teacherId: number;
                courseId: number;
                totalMarks: import("@prisma/client/runtime/library").Decimal;
                dueDate: Date;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                submissions: import("@prisma/client/runtime/library").JsonValue | null;
            };
        };
    }>;
    create(createAssignmentDto: CreateAssignmentDto): Promise<{
        status: string;
        data: {
            assignment: {
                teacher: {
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
                course: {
                    name: string;
                    description: string | null;
                    level: string;
                    schedule: import("@prisma/client/runtime/library").JsonValue | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    code: string;
                    subject: string;
                    teacherId: number | null;
                    credits: number;
                    maxStudents: number;
                    enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                    syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                    academicYear: string;
                    semester: import(".prisma/client").$Enums.Semester;
                };
            } & {
                description: string;
                title: string;
                level: string;
                className: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.AssignmentStatus;
                subject: string;
                teacherId: number;
                courseId: number;
                totalMarks: import("@prisma/client/runtime/library").Decimal;
                dueDate: Date;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                submissions: import("@prisma/client/runtime/library").JsonValue | null;
            };
        };
    }>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<{
        status: string;
        data: {
            assignment: {
                teacher: {
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
                course: {
                    name: string;
                    description: string | null;
                    level: string;
                    schedule: import("@prisma/client/runtime/library").JsonValue | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    code: string;
                    subject: string;
                    teacherId: number | null;
                    credits: number;
                    maxStudents: number;
                    enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                    syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                    academicYear: string;
                    semester: import(".prisma/client").$Enums.Semester;
                };
            } & {
                description: string;
                title: string;
                level: string;
                className: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.AssignmentStatus;
                subject: string;
                teacherId: number;
                courseId: number;
                totalMarks: import("@prisma/client/runtime/library").Decimal;
                dueDate: Date;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                submissions: import("@prisma/client/runtime/library").JsonValue | null;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
